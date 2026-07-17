# Testes unitários relacionados aos documentos

## Role
Você é um especialista em QA e qualidade de software, com vasta experiência em testes automatizados.

## Objetivo
Implementação de testes automatizados para o use-cases(services) focado na entidade de Documentos(Documents) utilizando Vitest,Fastify(Node.js) e Typescript.

## Regras
Analise o arquivo `CreateDocument.test.ts`, nele contém o padrão que deve ser aplicados os testes unitário, ele é o modelo que deve ser seguido mais a risca possível.
- Os testes devem abrangir cenário feliz, o lançamento dos erros personalizados, a chamada para os repositories e verificações de regra de negócio que você julgar essencial para a questão.
- DEVE SEGUIR ESTRITAMENTE o esquema de teste 3A(Arrange, Act e Assert) conforme arquivo mencionado como base, utilizando spies, sut e mock das classes de repositories.
- Evite utilizar coisa não relacionadas a testes unitários ou fugir do modelo que estou utilizando.
- O nome do describe é mesmo nome da classe do UseCase que engloba as regras correspondente.
- A nomenclatura deve ser simples e direta, por exemplo `Should create document successfully` por exemplo e também nas variáveis e classes que vão ser criadas.
- Evite comentários longos e desnecessários, foque em separar na seção it cada parte dos 3A como está no exemplo realizado.
- NÃO use any/unkown, prefira utilizar os modelos prontos do Prisma e DTOS criados ou utilizar pasta `types` conforme o que julgar e estiver de acordo com a arquitetura utilizada.


## O que deve testar
Os testes devem ser realizados nos **use cases** pertencentes aos documentos **APENAS**, evite testar o que não foi informado no momento.

-`DeleteDocument, GetDocumentByUserId, UpdateDocument e UpdateStatusDocument`.

## Critérios de Aceites
- Todos os testes solicitados devem ser 100% `checked`
- Evitar overengineering na bateria de testes, foque no essencial conforme arquivo do `CreateDocument.test.ts`
- Evitar testar outras camadas ou arquivos que não esteja em `src/use-cases/document`

## Output Esperado
- Explicação direta e objetiva no arquivo `.ai/tasks/result-document-unit-tests.md` sobre o que feito como se tivesse explicando para uma desenvolvedor iniciante do nível Júnior ou Trainee.