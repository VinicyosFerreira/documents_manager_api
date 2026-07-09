# 📑 Gerenciador de Documentos API

API REST para gerenciamento de documentos digitais, com autenticação de usuários, upload de arquivos PDF, controle de status de assinatura e armazenamento externo compatível com S3.

O projeto foi construído com foco em **organização por camadas**, **tipagem com TypeScript**, **validação de dados com Zod**, **persistência com PostgreSQL e Prisma ORM** e **armazenamento de documentos com MinIO**.

---

## 🚀 Objetivo do projeto

Esta API resolve um fluxo comum em sistemas de documentos:

- cadastro e autenticação de usuários;
- criação de documentos vinculados ao usuário autenticado;
- upload de arquivos PDF;
- listagem de documentos do próprio usuário;
- atualização de dados do documento;
- alteração do status para documento assinado;
- exclusão de documentos;
- geração de URL temporária para acesso seguro ao arquivo.

É uma base sólida para cenários como **assinatura digital**, **gestão documental**, **portais internos**, **backoffices administrativos** e integrações com front-ends web.

---

## 🧰 Tecnologias utilizadas

- **Node.js**: runtime JavaScript utilizado no back-end.
- **TypeScript**: adiciona tipagem estática e melhora a segurança do código.
- **Fastify**: framework HTTP rápido, performático e extensível.
- **Zod**: validação de dados de entrada e saída.
- **fastify-type-provider-zod**: integração entre Fastify, Zod e Swagger.
- **Prisma ORM**: camada de acesso ao banco de dados com tipagem e migrations.
- **PostgreSQL**: banco relacional usado para persistir usuários e metadados dos documentos.
- **MinIO**: armazenamento de arquivos compatível com S3.
- **AWS SDK S3**: comunicação com o MinIO usando protocolo S3.
- **Argon2**: hash seguro de senhas.
- **JWT**: autenticação stateless para rotas privadas.
- **Docker Compose**: orquestração local do PostgreSQL e MinIO.
- **Swagger UI**: documentação interativa da API.

---

## 🏗️ Decisões arquiteturais

O projeto segue uma organização inspirada em **Clean Architecture** e **SOLID**, separando responsabilidades em camadas bem definidas.

### Camadas principais

- **Routes**: recebem requisições HTTP, validam entrada e chamam os casos de uso.
- **Schemas**: definem contratos de entrada e saída com Zod.
- **Use Cases**: concentram as regras de negócio da aplicação.
- **Repositories**: encapsulam o acesso ao banco usando Prisma.
- **Factories**: montam os casos de uso com suas dependências.
- **DTOs**: padronizam os dados trafegados entre camadas.
- **Errors**: centralizam erros de domínio e respostas HTTP.
- **Hooks**: aplicam comportamentos transversais, como autenticação JWT.
- **Lib**: concentra configurações compartilhadas, como o Prisma Client.

### Padrões e conceitos aplicados

- **Factory Pattern**: usado em `src/factories` para instanciar use cases com seus repositories.
- **Repository Pattern**: usado em `src/repositories` para isolar a persistência de dados.
- **DTO Pattern**: usado em `src/dtos` para separar entrada, saída e representação interna.
- **Injeção de dependência manual**: os use cases recebem suas dependências pelo construtor.
- **Separação de responsabilidades**: rotas não acessam banco diretamente; repositories não conhecem HTTP.
- **Tratamento global de erros**: `setErrorHandler` centraliza respostas de erro.

---

## 📁 Estrutura de pastas

```text
.
├── prisma/
│   ├── migrations/              # Histórico de alterações do banco de dados
│   └── schema.prisma            # Modelagem das tabelas, enum e relações
├── generated/
│   └── prisma/                  # Cliente Prisma gerado automaticamente
├── src/
│   ├── dtos/                    # Tipos de entrada e saída entre camadas
│   ├── errors/                  # Erros customizados e handler global
│   ├── factories/               # Criação dos use cases com dependências
│   ├── hooks/                   # Hooks do Fastify, como validação JWT
│   ├── lib/                     # Configurações compartilhadas
│   ├── repositories/            # Acesso ao banco de dados via Prisma
│   ├── routes/                  # Definição das rotas HTTP
│   ├── schemas/                 # Schemas Zod de validação
│   ├── types/                   # Extensões de tipos do Fastify/JWT
│   ├── use-cases/               # Regras de negócio da aplicação
│   └── index.ts                 # Entrada principal da API
├── docker-compose.yml           # PostgreSQL e MinIO para ambiente local
├── package.json                 # Scripts e dependências do projeto
├── prisma.config.ts             # Configuração do Prisma
└── tsconfig.json                # Configuração do TypeScript
```

---

## 🧭 Rotas da API

### Usuários

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/users` | Não | Cria um usuário |
| `POST` | `/login` | Não | Realiza login e retorna JWT |
| `GET` | `/users/me` | Sim | Retorna dados do usuário autenticado |
| `PATCH` | `/users/me` | Sim | Atualiza dados do usuário autenticado |
| `DELETE` | `/users/me` | Sim | Realiza exclusão lógica do usuário |

### Documentos

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/documents/me` | Sim | Lista documentos do usuário autenticado |
| `POST` | `/documents/me` | Sim | Cria um documento com upload de PDF |
| `PATCH` | `/documents/:id` | Sim | Atualiza dados ou arquivo do documento |
| `PATCH` | `/documents/sign/:id` | Sim | Marca o documento como assinado |
| `DELETE` | `/documents/:id` | Sim | Remove o documento e o arquivo vinculado |

---

## ⚙️ Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/documents_manager_api"
PORT="8080"
MINIO_ROOT_USER="minioadmin"
MINIO_ROOT_PASSWORD="minioadmin"
JWT_SECRET="sua_chave_secreta"
```

### Variáveis

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `PORT` | Porta em que a API será executada |
| `MINIO_ROOT_USER` | Usuário root do MinIO |
| `MINIO_ROOT_PASSWORD` | Senha root do MinIO |
| `JWT_SECRET` | Chave usada para assinar e validar tokens JWT |

---

## 🔌 Dependências externas

O projeto depende dos seguintes serviços externos em ambiente local:

- **PostgreSQL**: banco de dados relacional.
- **MinIO**: armazenamento de arquivos PDF.

Eles podem ser executados com Docker Compose:

```bash
docker-compose up -d
```

Serviços disponíveis:

| Serviço | URL/Porta | Finalidade |
| --- | --- | --- |
| PostgreSQL | `localhost:5432` | Banco de dados da aplicação |
| MinIO API | `localhost:9000` | API S3 para upload e leitura |
| MinIO Console | `http://localhost:9001` | Interface administrativa do MinIO |

> Observação: a aplicação utiliza o bucket `documents`. Garanta que esse bucket exista no MinIO antes de testar o upload de documentos.

---

## 📦 Comandos de desenvolvimento

### Instalar dependências

```bash
npm install
```

O script `postinstall` executa automaticamente:

```bash
prisma generate
```

### Subir banco e storage

```bash
docker-compose up -d
```

### Rodar migrations

```bash
npx prisma migrate dev
```

### Gerar Prisma Client manualmente

```bash
npx prisma generate
```

### Iniciar em desenvolvimento

```bash
npm run dev
```

A API será iniciada por padrão em:

```text
http://localhost:8080
```

### Testes

Atualmente o projeto não possui script de testes configurado no `package.json`.

---

## 📚 Documentação da API

Com a aplicação em execução, acesse:

```text
http://localhost:8080/docs
```

A documentação é gerada com **Swagger UI** a partir dos schemas Zod integrados ao Fastify.

---

## ✅ Destaques técnicos

- Arquitetura modular e organizada por responsabilidade.
- Regras de negócio isoladas em use cases.
- Persistência desacoplada por repositories.
- Validação forte com Zod.
- Documentação automática com Swagger.
- Hash seguro de senhas com Argon2.
- Autenticação JWT em rotas privadas.
- Upload de arquivos via multipart.
- Armazenamento de PDFs em MinIO usando protocolo S3.
- Controle de acesso por dono do documento.
- Exclusão lógica para usuários.
- Exclusão física para documentos e seus arquivos.

---

## 🔗 Links relevantes

- **Repositório da API**: [documents_manager_api](https://github.com/VinicyosFerreira/documents_manager_api)
- **Repositório do front-end**: [documents_manager_frontend](https://github.com/VinicyosFerreira/documents_manager_frontend)
- **Documentação do Fastify**: [fastify.dev](https://fastify.dev/)
- **Documentação do Prisma**: [prisma.io/docs](https://www.prisma.io/docs)
- **Documentação do MinIO**: [min.io/docs](https://min.io/docs)
- **Documentação do Zod**: [zod.dev](https://zod.dev/)

---
