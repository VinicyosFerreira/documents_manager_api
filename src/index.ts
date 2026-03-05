import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import {
  createDocumentRoute,
  deleteDocumentRoute,
  getDocumentsRoute,
  updateStatusDocumentRoute,
} from './routes/index.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './errors/error-handler.js';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Document manager API',
      description: 'Document manager API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    tags: [
      {
        name: 'Document',
        description: 'Document manager API for SuperSign',
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.setErrorHandler(errorHandler);
await app.register(getDocumentsRoute, { prefix: '/documents' });
await app.register(createDocumentRoute, { prefix: '/documents' });
await app.register(updateStatusDocumentRoute, { prefix: '/documents' });
await app.register(deleteDocumentRoute, { prefix: '/documents' });

try {
  await app.listen({ port: 8080 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
