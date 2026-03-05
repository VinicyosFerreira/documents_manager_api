import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateDocumentUseCase,
  GetDocumentsUseCase,
  UpdateStatusDocumentUseCase,
  DeleteDocumentUseCase,
} from '../use-cases/index.js';
import {
  CreateDocumentRepository,
  GetDocumentByIdRepository,
  GetDocumentsRepository,
  UpdateStatusDocumentRepository,
  DeleteDocumentRepository,
} from '../repositories/index.js';
import {
  CreateDocumentSchema,
  ErrorSchema,
  ResponseDeleteDocumentSchema,
  ResponseSuccessSchema,
  ZodErrorSchema,
} from '../schemas/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: CreateDocumentSchema,
      response: {
        201: ResponseSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const createDocumentRepository = new CreateDocumentRepository();
      const createDocumentUseCase = new CreateDocumentUseCase(
        createDocumentRepository
      );
      const result = await createDocumentUseCase.execute(request.body);
      console.log(result);
      return reply.status(201).send(result);
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
      const getDocumentsRepository = new GetDocumentsRepository();
      const getDocumentsUseCase = new GetDocumentsUseCase(
        getDocumentsRepository
      );
      const result = await getDocumentsUseCase.execute();
      return reply.status(200).send(result);
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
        403: ErrorSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
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
    },
  });
};

export const deleteDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: ResponseDeleteDocumentSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const deleteDocumentRepository = new DeleteDocumentRepository();
      const getDocumentByIdRepository = new GetDocumentByIdRepository();
      const deleteDocumentUseCase = new DeleteDocumentUseCase(
        deleteDocumentRepository,
        getDocumentByIdRepository
      );

      await deleteDocumentUseCase.execute(request.params.id);
      return reply.status(200).send({
        message: 'Documento deletado com sucesso',
      });
    },
  });
};
