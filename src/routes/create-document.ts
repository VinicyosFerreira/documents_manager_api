import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { CreateDocumentUseCase } from '../use-cases/index.js';
import { CreateDocumentRepository } from '../repositories/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: z.object({
        titulo: z.string({}).trim().min(1),
        descricao: z.string().trim().min(1),
      }),
      response: {
        201: z.object({
          id: z.uuid(),
          titulo: z.string().trim().min(1),
          descricao: z.string().trim().min(1),
          status: z.enum(['PENDENTE', 'ASSINADO']),
        }),
        400: z.object({
          message: z.string({
            error: 'O título é obrigatório',
          }),
        }),
        500: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const createDocumentRepository = new CreateDocumentRepository();
        const createDocumentUseCase = new CreateDocumentUseCase(
          createDocumentRepository
        );
        const result = await createDocumentUseCase.execute(request.body);
        reply.status(201).send(result);
      } catch (err) {
        app.log.error(err);
        reply.status(500).send({ message: 'Internal server error' });
      }
    },
  });
};
