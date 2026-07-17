# Testes unitarios de documentos

Foram criados testes unitarios para os quatro use cases solicitados em `src/use-cases/document`:

- `GetDocumentsByUserIdUseCase`: busca os documentos do usuario, gera a URL assinada de cada arquivo, retorna lista vazia quando necessario e impede a consulta de usuarios inexistentes ou removidos.
- `UpdateDocumentUseCase`: atualiza titulo e descricao, substitui o arquivo quando enviado e bloqueia a troca de arquivo em documentos ja assinados.
- `UpdateStatusDocumentUseCase`: assina o documento e impede nova assinatura.
- `DeleteDocumentUseCase`: remove o arquivo do armazenamento antes de remover o registro do documento.

Os testes tambem verificam se os repositories e o armazenamento recebem os parametros esperados. Eles usam stubs e spies, portanto nao acessam banco de dados, MinIO ou API externa. Cada caso segue as tres etapas Arrange, Act e Assert.

As regras de seguranca cobertas sao: documento inexistente, documento pertencente a outro usuario e documento ja assinado quando a regra se aplica.
