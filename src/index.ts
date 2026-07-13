import 'dotenv/config';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import {
  createDocumentRoute,
  getDocumentsRoute,
  updateStatusDocumentRoute,
  updateDocumentRoute,
  deleteDocumentRoute,
} from './routes/documentRoute.js';
import {
  createUserRoute,
  deleteUserRoute,
  getUserByIdRoute,
  updateUserRoute,
  loginUserRoute,
  refreshTokenRoute,
} from './routes/userRoute.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './errors/error-handler.js';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyJwt from '@fastify/jwt';
import verifyToken from './hooks/verifyToken.js';
import fastifyCookie from '@fastify/cookie';

const app = Fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: ['http://localhost:3000'],
});

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || '',
  sign: {
    expiresIn: '30m',
  },
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || '',
  parseOptions: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    signed: true,
  },
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  attachFieldsToBody: 'keyValues',
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
      },
    ],
  },
  transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.setErrorHandler(errorHandler);

// Public routes to register/login
await app.register(loginUserRoute, { prefix: '/auth' });
await app.register(createUserRoute, { prefix: '/users' });
await app.register(refreshTokenRoute, { prefix: '/auth' });

// Private routes
app.register(async (privateRoute) => {
  await verifyToken(privateRoute);

  // users route
  await privateRoute.register(getUserByIdRoute, { prefix: '/users/me' });
  await privateRoute.register(updateUserRoute, { prefix: '/users/me' });
  await privateRoute.register(deleteUserRoute, { prefix: '/users/me' });

  // documents route
  await privateRoute.register(getDocumentsRoute, { prefix: '/documents/me' });
  await privateRoute.register(createDocumentRoute, { prefix: '/documents/me' });
  await privateRoute.register(updateStatusDocumentRoute, {
    prefix: '/documents/sign',
  });
  await privateRoute.register(deleteDocumentRoute, { prefix: '/documents/me' });
  await privateRoute.register(updateDocumentRoute, { prefix: '/documents/me' });
});

try {
  await app.listen({
    port: Number(process.env.PORT) || 8080,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
