# Teste Técnico – Desenvolvimento FullStack Júnior

Este repositório contém o código-fonte de um sistema simples de controle de categorias, produtos e estoque.
O projeto foi preparado como teste técnico para a posição de Desenvolvedor(a) FullStack Júnior na Plansul.

O objetivo não é apenas avaliar se a aplicação “funciona”, mas como você analisa problemas, toma decisões técnicas, organiza o código e documenta sua solução.

## Objetivo do Teste

**Avaliar a capacidade do(a) candidato(a) de:**

- Atuar tanto no backend quanto no frontend
- Identificar e corrigir erros existentes
- Reimplementar funcionalidades removidas
- Manter boas práticas de código e arquitetura
- Documentar soluções técnicas
- Refletir criticamente sobre o próprio trabalho

## Seu Desafio

O desafio está dividido em cinco partes principais: debugging, reimplementação e implementação de funcionalidades, reflexão e documentação.

### Parte 1: Debugging do Backend

Ao acessar a listagem de produtos, ocorre um erro na API.

**Tarefa**

- Identificar a causa do erro
- Corrigir o problema no backend
- Garantir que a listagem de produtos funcione corretamente

### Parte 2: Reimplementação e Integração do Módulo de Estoque

Atualmente, a funcionalidade de gerenciamento de estoque foi removida do sistema. Sua tarefa é reintroduzi-la.

**Tarefa:**

1.  **Backend:**
    - Crie os endpoints de API necessários para `estoque` (listagem, atualização) e `estoque_movimentacoes` (listagem, criação).
    - Reimplemente a lógica de serviço e repositório para interagir com o banco de dados (Prisma).
    - Certifique-se de que as operações de estoque (entrada/saída) afetem a quantidade de produtos no estoque de forma consistente.
    - **\*Nota** os valores dos itens no estoque so devem ser alterados por meio de movimentações de estoque.\*
2.  **Frontend:**
    - Reative as abas de "Estado do Estoque" e "Histórico de Movimentações" na interface.
    - Implemente as telas de listagem para o "Estado do Estoque" e "Histórico de Movimentações".
    - Implemente a funcionalidade para registrar novas movimentações de estoque (entrada e saída), utilizando um modal com formulário.

**Requisitos:**

- Utilize o Prisma ORM para todas as interações com o banco de dados.
- Mantenha a coerência com o estilo de código e padrões de arquitetura existentes no projeto (Next.js API Routes, services, repositories, React Query hooks).
- Garanta que a interface do usuário seja intuitiva e funcional para as novas funcionalidades.

### Parte 3: Filtros, Ordenação e Buscas

A partir da modelagem de dados, implemente melhorias na interface que facilitem a consulta e análise de informações.

Sugestões (não limitativas):

- **Filtros por categoria, marca, quantidade em estoque, tipo de movimentação, etc.**

- **Ordenação para todas as colunas das tabelas** (produtos, categorias, estoque e movimentações)

- **Busca personalizada**, por exemplo:
  - Pesquisar nome ou SKU de produtos

  - Pesquisar movimentações por produto ou tipo

```
💡 Use sua criatividade e conhecimento técnico para propor soluções práticas, mas consistentes com o projeto.
```

## Parte 4: Reflexão Técnica

Crie um arquivo (ex: `RESPOSTAS.md`) respondendo às perguntas:

**1. O que você fez?**

- Descreva as correções e implementações realizadas

- Explique seu processo de análise e desenvolvimento

**2. O que poderia ser diferente?** (Opcional)

- Algo que já existia no projeto que poderia ter outra abordagem

- Explique o motivo e o possível ganho para o sistema

**3. Sugestões de próximos passos** (Opcional)

- Melhorias, novas funcionalidades ou ajustes futuros

## Parte 5: Documentação

Crie dois arquivos de documentação:

**1. Documentação das APIs (`README_API.md`)**

- Endpoints, métodos HTTP, parâmetros e exemplos de request/response

**2. Documentação de uso do projeto (`README_USO.md`)**

- Como configurar, executar e utilizar a aplicação

## **Entrega**

A entrega deve ser realizada através de um **repositório público no GitHub**.

O repositório deve ser enviado **até às 23h59 do domingo, 25/01/2026**, por e-mail para:

**[consultor.ia@plansul.com.br](mailto:consultor.ia@plansul.com.br)**

Com o **assunto do e-mail**:

```
Teste Técnico FullStack Júnior - [Seu Nome]
```

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados em sua máquina:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Começando

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Plansul/junior-technical-assessment.git
    cd junior-technical-assessment
    ```

2.  **Instale as dependências:**
    Execute o seguinte comando para instalar todas as dependências do projeto listadas no `package.json`.

    ```bash
    npm install
    ```

3.  **Inicie o Banco de Dados:**
    Este comando irá iniciar um container Docker com o banco de dados PostgreSQL.

    ```bash
    docker-compose up -d
    ```

4.  **Restaure o Banco de Dados (Opcional, mas Recomendado):**
    Para garantir que seu banco de dados esteja no estado inicial esperado para o teste (com as tabelas `estoque` e `estoque_movimentacoes` vazias, mas prontas para serem usadas), você pode rodar o script de inicialização novamente.

    ```bash
    docker exec -i junior-technical-assessment-db-1 psql -U postgres -d postgres < sql/init.sql
    ```

    _Nota: O nome do container `junior-technical-assessment-db-1` pode variar dependendo do seu ambiente Docker. Verifique com `docker ps` se necessário._

5.  **Gere o Cliente Prisma:**
    O projeto usa o Prisma para interagir com o banco de dados. Após o banco de dados estar no ar e com o schema atualizado, você precisa gerar o cliente Prisma para que os tipos de `estoque` e `estoque_movimentacoes` sejam reconhecidos.
    ```bash
    npx prisma generate
    ```
6.  **Crie um arquivo .env**
    Crie um arquivo .env contendo:
    DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"
    Para conectar banco de dados
7.  **Execute a Aplicação:**
    Agora você pode iniciar o servidor de desenvolvimento do Next.js.

    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) em seu navegador para ver o resultado.

## Informações do Banco de Dados

O banco de dados PostgreSQL é executado dentro de um container Docker. As configurações de conexão estão definidas no arquivo `docker-compose.yml`:

- **Host:** `localhost`
- **Porta:** `5433`
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Nome do Banco:** `postgres`

## Scripts Disponíveis

Neste projeto, você pode executar os seguintes scripts:

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia um servidor de produção.
- `npm run lint`: Executa o linter para verificar a qualidade do código.

Boa sorte!
