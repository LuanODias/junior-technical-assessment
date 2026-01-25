# Documentação da API de Gestão de Inventário

Bem-vindo à documentação oficial da API de Gestão de Inventário. Esta API segue os princípios **REST** e fornece recursos para o gerenciamento de categorias, produtos e controle de estoque.

### Informações Gerais

- **Base URL:** Todas as requisições devem ser prefixadas com `/api`.
- **Formato de Dados:** JSON (`application/json`).
- **Serialização:** Devido ao uso de `BigInt` no banco de dados, todos os IDs e números grandes são serializados como **strings** nas respostas JSON para garantir compatibilidade com o frontend.

---

## 1. Categorias

Gerenciamento das categorias de classificação dos produtos.

### Listar Categorias

Retorna a lista completa de categorias cadastradas.

- **URL:** `/api/categorias`
- **Método:** `GET`
- **Resposta de Sucesso (200):**
  ```json
  [
    {
      "id": "1",
      "nome": "Eletrônicos",
      "descricao": "Dispositivos e gadgets"
    }
  ]
  ```

### Criar Categoria

Cadastra uma nova categoria no sistema.

- **URL:** `/api/categorias`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "nome": "string (obrigatório)",
    "descricao": "string (opcional)"
  }
  ```
- **Respostas:**
  - `201 Created`: Categoria criada com sucesso.
  - `400 Bad Request`: Campo `nome` ausente.

### Obter Categoria

Busca os detalhes de uma categoria específica.

- **URL:** `/api/categorias/[id]`
- **Método:** `GET`
- **Respostas:**
  - `200 OK`: Retorna o objeto da categoria.
  - `404 Not Found`: Categoria não encontrada.
  - `400 Bad Request`: ID inválido.

### Atualizar Categoria

Atualiza os dados de uma categoria existente.

- **URL:** `/api/categorias/[id]`
- **Método:** `PUT`
- **Corpo da Requisição:**
  ```json
  {
    "nome": "Novos Eletrônicos",
    "descricao": "Descrição atualizada"
  }
  ```
- **Respostas:**
  - `200 OK`: Categoria atualizada.
  - `404 Not Found`: Categoria não encontrada.

### Excluir Categoria

Remove permanentemente uma categoria.

- **URL:** `/api/categorias/[id]`
- **Método:** `DELETE`
- **Respostas:**
  - `204 No Content`: Exclusão bem-sucedida.
  - `404 Not Found`: Categoria não encontrada.

---

## 2. Produtos

Gerenciamento do catálogo de produtos.

### Listar Produtos

Retorna a lista completa de produtos.

- **URL:** `/api/produtos`
- **Método:** `GET`
- **Resposta de Sucesso (200):**
  ```json
  [
    {
      "id": "10",
      "sku": "PROD-001",
      "nome": "Smartphone X",
      "marca": "TechBrand",
      "estoque_minimo": 5,
      "categoria_id": "1"
    }
  ]
  ```

### Criar Produto

Cadastra um novo produto.

- **URL:** `/api/produtos`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "sku": "string (obrigatório)",
    "nome": "string (obrigatório)",
    "categoria_id": "string | number (opcional)",
    "estoque_minimo": "number (opcional)",
    "marca": "string (opcional)"
  }
  ```
- **Respostas:**
  - `201 Created`: Produto criado.
  - `400 Bad Request`: `sku` ou `nome` ausentes.

### Obter Produto

Busca os detalhes de um produto específico.

- **URL:** `/api/produtos/[id]`
- **Método:** `GET`
- **Respostas:**
  - `200 OK`: Retorna o objeto do produto.
  - `404 Not Found`: Produto não encontrado.

### Atualizar Produto

Atualiza as informações de um produto.

- **URL:** `/api/produtos/[id]`
- **Método:** `PUT`
- **Corpo da Requisição:** Aceita os mesmos campos do método `POST` (sku, nome, categoria_id, etc).
- **Respostas:**
  - `200 OK`: Produto atualizado.
  - `404 Not Found`: Produto não encontrado.

### Excluir Produto

Remove um produto do catálogo.

- **URL:** `/api/produtos/[id]`
- **Método:** `DELETE`
- **Respostas:**
  - `204 No Content`: Exclusão bem-sucedida.
  - `404 Not Found`: Produto não encontrado.

---

## 3. Estoque e Movimentações

Controle de saldo e histórico de operações.

### Consultar Saldo de Estoque

Retorna a visão atual consolidada do estoque (Snapshot).

- **URL:** `/api/estoque`
- **Método:** `GET`
- **Resposta de Sucesso (200):**
  ```json
  [
    {
      "produto_id": "10",
      "produto_nome": "Smartphone X",
      "saldo": 50
    }
  ]
  ```

### Consultar Histórico de Movimentações

Retorna o log completo de entradas e saídas.

- **URL:** `/api/estoque_movimentacoes`
- **Método:** `GET`
- **Resposta de Sucesso (200):** Lista de todas as transações realizadas.

### Registrar Movimentação

Registra uma entrada ou saída de mercadoria, atualizando o saldo.

- **URL:** `/api/estoque_movimentacoes`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "produto_id": "string (obrigatório)",
    "quantidade": "number (obrigatório - deve ser positivo)",
    "tipo": "entrada | saida"
  }
  ```
- **Regras de Negócio:**
  1.  O `tipo` deve ser estritamente `"entrada"` ou `"saida"`.
  2.  Não é possível registrar uma saída se o saldo resultante for negativo.
- **Respostas:**
  - `201 Created`: Movimentação registrada com sucesso.
  - `400 Bad Request`: Erro de validação ou **Saldo insuficiente**.
