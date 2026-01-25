## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- **Node.js** (Versão 18 ou superior recomendada)
- **npm** (Gerenciador de pacotes do Node)
- **Docker** e **Docker Compose** (Para rodar o banco de dados PostgreSQL)

---

## 🚀 Passo a Passo para Instalação

### 1. Instalar Dependências

Na raiz do projeto, execute o comando para baixar todas as bibliotecas necessárias listadas no `package.json`:

```bash
npm install
```

### 2\. Configurar o Banco de Dados (Docker)

Este projeto utiliza um banco de dados PostgreSQL que deve ser executado via container. Para iniciar o serviço, utilize o comando:

Bash

    docker-compose up -d

### 3\. Inicializar o Schema e Popular o Banco (Opcional)

Para garantir que o banco de dados esteja no estado inicial esperado (com as tabelas preparadas), execute o script SQL de inicialização:

Bash

    docker exec -i junior-technical-assessment-db-1 psql -U postgres -d postgres < sql/init.sql

> **Nota:** O nome do container (`junior-technical-assessment-db-1`) pode variar dependendo do seu sistema. Verifique com `docker ps` se necessário.

### 4\. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e configure a URL de conexão com o banco de dados:

Snippet de código

    DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"

### 5\. Gerar o Cliente Prisma

Sempre que houver alterações no schema ou após a primeira instalação, é necessário gerar o cliente do Prisma para que as tipagens do estoque e movimentações sejam reconhecidas:

Bash

    npx prisma generate

### 6\. Executar a Aplicação

Com o banco configurado e as dependências instaladas, inicie o servidor de desenvolvimento:

Bash

    npm run dev

Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador para utilizar o sistema.

---

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Executa a verificação de qualidade do código.

---

## 🗄️ Informações de Conexão (PostgreSQL)

O banco de dados PostgreSQL é executado dentro de um container Docker. As configurações de conexão estão definidas no arquivo docker-compose.yml:

- **Host:** `localhost`
- **Porta:** `5433`
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Nome do Banco:** `postgres`
