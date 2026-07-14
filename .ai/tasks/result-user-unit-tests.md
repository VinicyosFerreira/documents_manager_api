# Resultado dos testes unitários de usuário

Foram implementados testes unitários para os use cases de usuário solicitados:

- `GetUserByIdUseCase`
- `LoginUserUseCase`
- `UpdateUserUseCase`
- `DeleteUserUseCase`

Os testes seguem o mesmo padrão do arquivo `CreateUser.test.ts`, usando:

- estrutura **Arrange, Act e Assert**;
- criação de `sut` para representar o use case testado;
- stubs para simular repositories;
- spies do Vitest para validar chamadas aos repositories;
- erros personalizados da aplicação para validar regras de negócio.

## O que foi validado

### GetUserByIdUseCase

- Busca de usuário por ID com sucesso.
- Chamada do repository com o ID correto.
- Erro quando o usuário não existe.
- Erro quando o usuário está deletado logicamente.

### LoginUserUseCase

- Login com email e senha válidos.
- Chamada do repository com o email correto.
- Validação da senha com Argon2.
- Erro quando o usuário não existe.
- Erro quando o usuário está deletado logicamente.
- Erro quando a senha é inválida.

### UpdateUserUseCase

- Atualização de usuário com sucesso.
- Busca do usuário pelo ID antes de atualizar.
- Validação de email quando o email é enviado.
- Validação de CPF quando o CPF é enviado.
- Chamada do repository de atualização com os dados corretos.
- Não valida email quando ele não é enviado.
- Não valida CPF quando ele não é enviado.
- Erro quando o usuário não existe.
- Erro quando o usuário está deletado logicamente.
- Erro quando já existe usuário com o mesmo email.
- Erro quando já existe usuário com o mesmo CPF.

### DeleteUserUseCase

- Exclusão lógica de usuário com sucesso.
- Busca do usuário pelo ID antes de deletar.
- Chamada do repository de delete com o ID correto.
- Erro quando o usuário não existe.
- Erro quando o usuário já está deletado logicamente.

Esses testes focam somente na regra de negócio dos use cases, sem acessar banco de dados, rotas HTTP ou outras camadas da aplicação.
