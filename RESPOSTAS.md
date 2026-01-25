# Reflexão Técnica - Teste FullStack Júnior

## 1. O que eu fiz?

### Debugging (Parte 1)

Identifiquei a falha na função `GET()` do arquivo `app/api/produtos/route.ts`, que retornava um erro 500 sem realizar a busca dos dados no banco.

> **Minha Solução Técnica:**
> Reimplementei a função `GET` utilizando como base a estrutura funcional da rota de Categorias (`app/api/categorias/route.ts`). Adicionei a chamada correta ao `service` para recuperar a lista de produtos do banco de dados e retornar o JSON com status 200, restabelecendo o funcionamento da listagem.

### Correção na Edição de Produtos e Categorias

Encontrei um erro de validação (Zod) que impedia a edição. Notei que os schemas `updateCategoriaSchema` e `updateProdutoSchema` exigiam o campo `id` no payload do corpo da requisição (`body`), mas a arquitetura REST da aplicação passa o ID via parâmetro de rota (URL) ou contexto, não no corpo JSON.

> **Minha Solução Técnica:**
> Apliquei o método utilitário `.omit({ id: true })` do Zod nos arquivos dos modais de edição (`*-edit-modal.tsx`). Com isso, desacoplei a validação do formulário (Frontend) da validação estrita do banco, permitindo o envio do payload correto sem comprometer a tipagem.

### Implementação do Módulo de Estoque (Backend)

Segui rigorosamente a Clean Architecture / Arquitetura em Camadas proposta no boilerplate para desenvolver este módulo:

- **Camadas:** Implementei isoladamente os `Repositories` (acesso ao dados), `Services` (regras de negócio) e `Controllers/Routes` (Next.js API Routes).
- **Endpoints:** Criei as rotas `/api/estoque` e `/api/estoque_movimentacoes`.
- **Integridade de Dados:** Centralizei a lógica de controle de estoque no Service.
  - _Regra de Negócio:_ Defini que o saldo na tabela `Estoque` não seria editável diretamente; implementei de forma que ele seja uma consequência (efeito colateral) calculado apenas após a persistência bem-sucedida de uma `EstoqueMovimentacao`.
- **Adaptação:** Consegui me adaptar rapidamente ao padrão de injeção de dependência e separação de responsabilidades já existentes no projeto.

### Interface e Frontend (Frontend)

- **Composição de Views:** Criei as views `EstoqueView` e `MovimentacoesView`, estendendo a versatilidade do componente genérico `DataTable`.
- **Gerenciamento de Cache (Server State):** Integrei os formulários de criação ("Nova Movimentação") com o `React Query` (`invalidateQueries`), garantindo consistência UI/Server sem a necessidade de _page reload_.
- **Filtros Facetados (Client-Side):**
  - **Estoque:** Criei uma lógica de _derived state_ para categorizar itens em "Normal", "Baixo" (quando `qtd <= estoque_minimo`) e "Esgotado".
  - **Movimentações:** Implementei um filtro booleano visual para tipos "Entrada" e "Saída".
- **UX e Acessibilidade:**
  - **Heurísticas de Nielsen:** Apliquei a heurística de _Correspondência com o Mundo Real_ utilizando ícones intuitivos (setas para cima/baixo, alertas) e cores semânticas. Meu objetivo foi permitir que o usuário identifique instantaneamente o tipo de movimentação e status de estoque, reduzindo a carga cognitiva.
  - **Segurança:** Foi removido qualquer erro que o ESLint apontou no projeto.

---

## 2. O que poderia ser diferente?

### Paginação e Filtros (Server-Side vs Client-Side)

Foi utilizado o `TanStack Table` para processar paginação e filtros no navegador a pedido do case.

- **Limitação:** Reconheço que, com o crescimento vertical da base de dados (> 10k registros), o payload inicial da API tornará a aplicação lenta.
- **Melhoria Arquitetural:** Em um cenário de escala, eu migraria para **Server-Side Pagination**. A API passaria a aceitar Query Params (`?page=1&limit=20&orderBy=sku:desc`) e eu utilizaria o Prisma `skip/take` para retornar apenas o subset necessário, reduzindo drasticamente o tráfego de rede e uso de memória no cliente.

### Sincronização de Estado via URL

O estado dos filtros que implementei é volátil (reside apenas na memória do React).

- **Melhoria:** Poderia ter implementado **URL State Synchronization**. Ao filtrar por "Marca: Nike", a URL deveria atualizar para `?marca=Nike`. Isso permitiria o compartilhamento de links e melhoraria a experiência do usuário ao usar os botões "Voltar/Avançar" do navegador.

### Transações Atômicas (ACID)

Minha implementação atualiza o saldo de estoque sequencialmente à criação da movimentação.

- **Risco:** Se a movimentação for criada mas o update do saldo falhar (ex: queda de conexão), o banco ficará inconsistente.
- **Melhoria:** O ideal seria envolver as operações de `create` (Movimentação) e `update` (Estoque) dentro de uma `prisma.$transaction([...])`. Isso garantiria atomicidade: ou tudo é salvo, ou nada é salvo.

---

## 3. Sugestões de próximos passos

### Frontend

1.  **Virtualização de Tabelas:** Sugiro implementar `tanstack/react-virtual` para renderizar apenas as linhas visíveis da DOM. Isso permitiria manter a performance fluida mesmo carregando listas com milhares de itens no front-end.
2.  **Dashboard com Lazy Loading:** Desenvolveria a tela de Dashboard utilizando `Recharts`, aplicando `React.lazy` e `Suspense` para carregar os componentes gráficos sob demanda, otimizando o _First Contentful Paint (FCP)_.

### Backend & Arquitetura

3.  **Caching com Redis (Cache-Aside Pattern):** Para endpoints de leitura intensiva (como o futuro Dashboard), implementaria uma camada de cache com Redis. O cache seria invalidado apenas nos eventos de escrita (`POST/PUT/DELETE`), reduzindo a carga no PostgreSQL.
4.  **Autenticação RBAC (Role-Based Access Control):** Integraria **NextAuth**. Implementaria Middleware para proteção de rotas e decoradores nos Services para garantir que apenas usuários com _role_ `MANAGER` pudessem realizar ajustes manuais ou saídas de estoque críticas.

### Qualidade de Software (QA)

5.  **Estratégia de Testes:**
    - **Unitários (Jest/Vitest):** Cobriria 100% das regras de negócio nos `Services` (ex: garantir que não é possível dar saída em produto com saldo zero).
    - **Integração (Supertest/Jest):** Testaria os endpoints da API simulando requisições reais e validando os Status Codes HTTP.
    - **E2E (Playwright):** Automatizaria o fluxo crítico do usuário: "Login -> Criar Produto -> Realizar Entrada -> Verificar Saldo".
