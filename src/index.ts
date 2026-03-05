import Fastify, { FastifyError } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod';
import {
  createDocumentRoute,
  getDocumentsRoute,
  updateStatusDocumentRoute,
} from './routes/document.js';
const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', async () => {
  return { hello: 'world' };
});

app.setErrorHandler((error: FastifyError, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .serializer((payload) => JSON.stringify(payload))
      .send({
        message:
          'O título ou descrição precisam ser texto e não podem estar vazios',
        code: 'BAD_REQUEST',
      });
  }

  return reply.status(500).send({
    message: 'Internal server error',
    code: error.code,
  });
});

await app.register(getDocumentsRoute, { prefix: '/documents' });
await app.register(createDocumentRoute, { prefix: '/documents' });
await app.register(updateStatusDocumentRoute, { prefix: '/documents' });

try {
  await app.listen({ port: 8080 });
  console.log('Server running on http://localhost:8080');
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
