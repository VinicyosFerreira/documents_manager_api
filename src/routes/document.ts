import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateDocumentUseCase,
  GetDocumentsUseCase,
  UpdateStatusDocumentUseCase,
} from '../use-cases/index.js';
import {
  CreateDocumentRepository,
  GetDocumentByIdRepository,
  GetDocumentsRepository,
  UpdateStatusDocumentRepository,
} from '../repositories/index.js';
import {
  CreateDocumentSchema,
  ErrorSchema,
  ResponseSuccessSchema,
} from '../schemas/index.js';
import {
  DocumentAlreadySignedError,
  DocumentNotFoundError,
} from '../errors/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: CreateDocumentSchema,
      response: {
        201: ResponseSuccessSchema,
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
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  });
};

export const getDocumentsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: z.array(ResponseSuccessSchema),
        500: ErrorSchema,
      },
    },
    handler: async (_, reply) => {
      try {
        const getDocumentsRepository = new GetDocumentsRepository();
        const getDocumentsUseCase = new GetDocumentsUseCase(
          getDocumentsRepository
        );
        const result = await getDocumentsUseCase.execute();
        return reply.status(200).send(result);
      } catch (err) {
        app.log.error(err);
        return reply.status(500).send({
          error: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  });
};

export const updateStatusDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: ResponseSuccessSchema,
        400: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      try {
        const updateStatusDocumentRepository =
          new UpdateStatusDocumentRepository();
        const getDocumentByIdRepository = new GetDocumentByIdRepository();
        const updateStatusDocumentUseCase = new UpdateStatusDocumentUseCase(
          updateStatusDocumentRepository,
          getDocumentByIdRepository
        );
        const result = await updateStatusDocumentUseCase.execute(
          request.params.id
        );
        return reply.status(200).send(result);
      } catch (err) {
        app.log.error(err);

        if (err instanceof DocumentNotFoundError) {
          return reply.status(404).send({
            error: 'Documento não encontrado',
            code: 'NOT_FOUND',
          });
        }

        if (err instanceof DocumentAlreadySignedError) {
          return reply.status(403).send({
            error:
              'Documento já assinado, você não tem permissão para alterar o status',
            code: 'FORBIDDEN',
          });
        }

        return reply.status(500).send({
          error: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    },
  });
};
