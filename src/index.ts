import Fastify, { FastifyError } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod';
import {
  createDocumentRoute,
  deleteDocumentRoute,
  getDocumentsRoute,
  updateStatusDocumentRoute,
} from './routes/document.js';
import {
  DocumentAlreadySignedError,
  DocumentNotFoundError,
} from './errors/index.js';
const app = Fastify({
  // logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', async () => {
  return { hello: 'world' };
});

app.setErrorHandler((error: FastifyError, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    console.log(error);
    if (error.validationContext === 'body') {
      return reply.status(400).send({
        message: error.validation.map((v) => v.message).join(''),
        code: 'BAD_REQUEST',
      });
    }

    return reply.status(400).send({
      message: error.validation.map((v) => v.message).join(''),
      code: 'BAD_REQUEST',
    });
  }

  if (error instanceof DocumentAlreadySignedError) {
    return reply.status(403).send({
      error:
        'Documento já assinado, você não tem permissão para alterar o status',
      code: 'FORBIDDEN',
    });
  }

  if (error instanceof DocumentNotFoundError) {
    return reply.status(404).send({
      error: 'Documento não encontrado',
      code: 'NOT_FOUND',
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
});

await app.register(getDocumentsRoute, { prefix: '/documents' });
await app.register(createDocumentRoute, { prefix: '/documents' });
await app.register(updateStatusDocumentRoute, { prefix: '/documents' });
await app.register(deleteDocumentRoute, { prefix: '/documents' });

try {
  await app.listen({ port: 8080 });
  console.log('Server running on http://localhost:8080');
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
