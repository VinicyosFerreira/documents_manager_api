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
  updateDocumentRoute,
} from './routes/documentRoute.js';
import { createUserRoute } from './routes/userRoute.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './errors/error-handler.js';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';

const app = Fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: ['http://localhost:3000'],
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  attachFieldsToBody: true
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
        description: 'Document manager API for signed documents',
      },
      {
        name: 'User',
        description: 'User manager API for signed documents',
      }
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.setErrorHandler(errorHandler);
await app.register(createUserRoute, { prefix: '/users' });
await app.register(getDocumentsRoute, { prefix: '/documents' });
await app.register(createDocumentRoute, { prefix: '/documents' });
await app.register(updateStatusDocumentRoute, { prefix: '/documents/sign' });
await app.register(deleteDocumentRoute, { prefix: '/documents' });
await app.register(updateDocumentRoute, { prefix: '/documents' });
try {
  await app.listen({
    port: Number(process.env.PORT) || 8080
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
