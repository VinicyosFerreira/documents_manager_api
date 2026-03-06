# 📑 Gerenciador de Documentos (API)
### Uma solução REST robusta, estruturada para o gerenciamento de documentos.


## 🚀 Tecnologias
**Node.js & TypeScript**: Runtime e linguagem base para viabilizar um código tipado e seguro.

**Fastify**: Framework para a construção do servidor HTTP

**PostgreSQL**: Banco de dados relacional para persistência sólida dos dados.

**Prisma ORM**: Ferramenta utilizada para redesenhar a interação com o banco, garantindo migrations consistentes e tipagem ponta a ponta.

**Docker**: Utilizado para colaborar com um ambiente de desenvolvimento isolado e replicável.

**Zod**: Validação de schemas e dados de entrada.

## 📁 Estrutura do Projeto
```
prisma/           # Setup do Prisma (schema e migrations)
src/
├── lib/          # Gera o cliente do Prisma    
├── dtos/         # DTOS de entrada e saída
├── use-cases/    # Centraliza as regras de negócio da aplicação
├── repositories/ # Camada de abstração do banco de dados (Prisma)
├── routes/       # Definição, validação e agrupamento das rotas HTTP
├── schemas/      # Definições de validação de dados com Zod.
├── errors/       # Tratamento de exceções personalizadas.
└── index.ts     # Ponto de entrada da aplicação e geração do swagger

```

## 🗺️ Explorando o código
**Arquitetura em Camadas**: Aplicação dividida em use-cases e repositories, garantindo que a lógica de negócio seja independente da infraestrutura utilizando DTOs e schema para estruturação e validação de dados tipada.

**Tratamento de Errors**: Uso do setErrorHandler global para centralização do tratamento de erros da API.

**Injeção de Dependência**: Estrutura que facilita a manutenção e a testabilidade dos módulos, seguindo principios do SOLID e Clean Architecture.

**Segurança e Validação**: Uso Zod integrado com Fastify garantindo schemas validados e seguros.

**Prisma ORM**: Utilização da ORM mais utilizada no Node.js, implementado modelagem de dados e CRUD sql de forma abstraída focando no código e regra de negócio.

**Docker Compose**: Banco de dados Postgres servido por um container docker podendo ser instalado com um comando.

## 📦 Como rodar localmente
**1.Clonar o projeto** 

``git clone https://github.com/VinicyosFerreira/documents_manager_api ``

``cd documents_manager_api``

**2.Configurar o env**: Crie um arquivo .env para o database e configure uma PORT seguindo o .env.example

**3.Docker compose**: `docker-compose up -d`

**4.Dependências**: `npm install`

**5.Migrates**: `npx prisma migrate dev`

**6.Rodar**: `npm run dev`

🔗 Links

**OBS: Projeto estruturado em Multirepo visando a separação clara de stacks. Essa abordagem permite a escalibilidade isolada de cada camada**

**Código Fonte**: [https://github.com/VinicyosFerreira/documents_manager_api]

**Codigo Fonte Front-End**: ["https://github.com/VinicyosFerreira/documents_manager_frontend]
