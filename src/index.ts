import Fastify, { FastifyError } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createDocumentRoute } from './routes/create-document.js';
const app = Fastify({
  logger: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/', async () => {
  return { hello: 'world' };
});

app.setErrorHandler((error: FastifyError, _, reply) => {
  console.log(error);
  if (error.statusCode === 400) {
    return reply.status(400).send({
      message: "O campo 'titulo e descrição' é obrigatório",
    });
  }

  return reply.status(500).send({
    message: 'Internal server error',
  });
});

await app.register(createDocumentRoute, { prefix: '/documents' });

try {
  await app.listen({ port: 8080 });
  console.log('Server running on http://localhost:8080');
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
