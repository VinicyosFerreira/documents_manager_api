import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateDocumentUseCase,
  GetDocumentsUseCase,
} from '../use-cases/index.js';
import {
  CreateDocumentRepository,
  GetDocumentsRepository,
} from '../repositories/index.js';
import { CreateDocumentSchema, ErrorSchema } from '../schemas/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: CreateDocumentSchema,
      response: {
        201: z.object({
          id: z.uuid(),
          titulo: z.string().trim().min(1),
          descricao: z.string().trim().min(1),
          status: z.enum(['PENDENTE', 'ASSINADO']),
          criado_em: z.date(),
        }),
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const createDocumentRepository = new CreateDocumentRepository();
        const createDocumentUseCase = new CreateDocumentUseCase(
          createDocumentRepository
        );
        const result = await createDocumentUseCase.execute(request.body);
        console.log(result);
        return reply.status(201).send(result);
      } catch (err) {
        app.log.error(err);
        return reply.status(500).send({
          error: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        });
      }
    },
  });
};

export const getDocumentsRoute = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    try {
      const getDocumentsRepository = new GetDocumentsRepository();
      const getDocumentsUseCase = new GetDocumentsUseCase(
        getDocumentsRepository
      );
      const result = await getDocumentsUseCase.execute();
      reply.status(200).send(result);
    } catch (err) {
      app.log.error(err);
      reply.status(500).send({ message: 'Internal server error' });
    }
  });
};
