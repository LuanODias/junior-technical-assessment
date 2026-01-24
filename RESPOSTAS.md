# Reflexão Técnica - Teste FullStack Júnior

## 1. O que você fez?

### Debugging (Parte 1)

Foi identificada uma falha crítica na função `GET()` do arquivo `app/api/produtos/route.ts`, que retornava sistematicamente um erro 500 sem realizar a busca dos dados no banco.

> **Solução Técnica:**
> Reimplementei a função `GET` utilizando como base a estrutura funcional da rota de Categorias (`app/api/categorias/route.ts`). Adicionei a chamada correta ao `service` para recuperar a lista de produtos do banco de dados e retornar o JSON com status 200, restabelecendo o funcionamento da listagem.

### Correção na Edição de Produtos e Categorias

Havia um erro de validação (Zod) que impedia a edição. Os schemas `updateCategoriaSchema` e `updateProdutoSchema` exigiam o campo `id` no payload do corpo da requisição (`body`), mas a arquitetura REST da aplicação passa o ID via parâmetro de rota (URL) ou contexto, não no corpo JSON.

> **Solução Técnica:**
> Apliquei o método utilitário `.omit({ id: true })` do Zod nos arquivos dos modais de edição (`*-edit-modal.tsx`). Isso desacoplou a validação do formulário (Frontend) da validação estrita do banco, permitindo o envio do payload correto sem comprometer a tipagem.

### Implementação do Módulo de Estoque (Backend)

O desenvolvimento seguiu rigorosamente a Clean Architecture / Arquitetura em Camadas proposta no boilerplate:

- **Camadas:** Implementação isolada de `Repositories` (acesso ao dados), `Services` (regras de negócio) e `Controllers/Routes` (Next.js API Routes).
- **Endpoints:** Criação das rotas `/api/estoque` e `/api/estoque_movimentacoes`.
- **Integridade de Dados:** A lógica de controle de estoque foi centralizada no Service.
  - _Regra de Negócio:_ O saldo na tabela `Estoque` não é editável diretamente; ele é uma consequência (efeito colateral) calculado apenas após a persistência bem-sucedida de uma `EstoqueMovimentacao`.
- **Adaptação:** Aderência rápida ao padrão de injeção de dependência e separação de responsabilidades já existentes no projeto.

### Interface e Frontend (Frontend)

- **Composição de Views:** Criação de `EstoqueView` e `MovimentacoesView`, estendendo a versatilidade do componente genérico `DataTable`.
- **Gerenciamento de Cache (Server State):** Integração dos formulários de criação ("Nova Movimentação") com o `React Query` (`invalidateQueries`), garantindo consistência UI/Server sem a necessidade de _page reload_.
- **Filtros Facetados (Client-Side):**
  - **Estoque:** Lógica de _derived state_ para categorizar itens em "Normal", "Baixo" (quando `qtd <= estoque_minimo`) e "Esgotado".
  - **Movimentações:** Filtro booleano visual para tipos "Entrada" e "Saída".
- **UX e Acessibilidade:**
  - Correção da área de clique nos cabeçalhos de ordenação (`h-12 -ml-4 w-full`) para melhorar a lei de Fitts.
  - Remoção de `any` em componentes críticos (`createSortableHeader`), restaurando a segurança de tipo do TypeScript.
  - Feedback visual semântico (ícones Lucide e cores de status).

---

## 2. O que poderia ser diferente?

### Paginação e Filtros (Server-Side vs Client-Side)

Atualmente, utilizamos o `TanStack Table` para processar paginação e filtros no navegador.

- **Limitação:** Com o crescimento vertical da base de dados (> 10k registros), o payload inicial da API tornará a aplicação lenta (TTFB alto).
- **Melhoria Arquitetural:** Migrar para **Server-Side Pagination**. A API passaria a aceitar Query Params (`?page=1&limit=20&orderBy=sku:desc`) e o Prisma utilizaria `skip/take` para retornar apenas o subset necessário, reduzindo drasticamente o tráfego de rede e uso de memória no cliente.

### Sincronização de Estado via URL

O estado dos filtros é volátil (reside apenas na memória do React).

- **Melhoria:** Implementar **URL State Synchronization**. Ao filtrar por "Marca: Nike", a URL deveria atualizar para `?marca=Nike`. Isso permite compartilhamento de links (Deep Linking) e melhora a experiência do usuário ao usar os botões "Voltar/Avançar" do navegador.

### Transações Atômicas (ACID)

A atualização do saldo de estoque ocorre sequencialmente à criação da movimentação.

- **Risco:** Se a movimentação for criada mas o update do saldo falhar (ex: queda de conexão), o banco ficará inconsistente.
- **Melhoria:** Envolver as operações de `create` (Movimentação) e `update` (Estoque) dentro de uma `prisma.$transaction([...])`. Isso garante atomicidade: ou tudo é salvo, ou nada é salvo.

---

## 3. Sugestões de próximos passos

### Frontend Engineering

1.  **Virtualização de Tabelas:** Implementar `tanstack/react-virtual` para renderizar apenas as linhas visíveis da DOM. Isso permitiria manter a performance fluida mesmo carregando listas com milhares de itens no front-end.
2.  **Dashboard com Lazy Loading:** Desenvolver a tela de Dashboard utilizando `Recharts`, aplicando `React.lazy` e `Suspense` para carregar os componentes gráficos sob demanda, otimizando o _First Contentful Paint (FCP)_.

### Backend & Arquitetura

3.  **Caching com Redis (Cache-Aside Pattern):** Para endpoints de leitura intensiva (como o futuro Dashboard), implementar uma camada de cache com Redis. O cache seria invalidado apenas nos eventos de escrita (`POST/PUT/DELETE`), reduzindo a carga no PostgreSQL.
4.  **Autenticação RBAC (Role-Based Access Control):** Integrar **NextAuth.js v5**. Implementar Middleware para proteção de rotas e decoradores nos Services para garantir que apenas usuários com _role_ `MANAGER` possam realizar ajustes manuais ou saídas de estoque críticas.

### Qualidade de Software (QA)

5.  **Estratégia de Testes:**
    - **Unitários (Vitest):** Cobrir 100% das regras de negócio nos `Services` (ex: garantir que não é possível dar saída em produto com saldo zero).
    - **Integração (Supertest/Jest):** Testar os endpoints da API simulando requisições reais e validando os Status Codes HTTP.
    - **E2E (Playwright):** Automatizar o fluxo crítico do usuário: "Login -> Criar Produto -> Realizar Entrada -> Verificar Saldo".
