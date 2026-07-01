import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateDocumentUseCase,
  GetDocumentsUseCase,
  UpdateStatusDocumentUseCase,
  DeleteDocumentUseCase,
  UpdateDocumentUseCase,
  UploadStorageUseCase,
} from '../use-cases/index.js';
import {
  CreateDocumentRepository,
  GetDocumentByIdRepository,
  GetDocumentsRepository,
  UpdateStatusDocumentRepository,
  DeleteDocumentRepository,
  UpdateDocumentRepository,
} from '../repositories/index.js';
import {
  CreateDocumentSchema,
  ErrorSchema,
  UpdateDocumentSchema,
  ResponseDeleteDocumentSchema,
  ResponseDocumentSuccessSchema,
  ZodErrorSchema,
} from '../schemas/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: CreateDocumentSchema,
      tags: ['Document'],
      response: {
        201: ResponseDocumentSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const createDocumentRepository = new CreateDocumentRepository();
      const uploadStorageUseCase = new UploadStorageUseCase();
      const createDocumentUseCase = new CreateDocumentUseCase(
        createDocumentRepository,
        uploadStorageUseCase
      );

      const file = request.body.file;

      if (!file || file.mimetype !== 'application/pdf') {
        return reply.status(400).send({
          code: 'BAD_REQUEST',
          error: 'Arquivo inválido, obrigatoriamente PDF',
        });
      }

      const result = await createDocumentUseCase.execute({
        ...request.body,
        file,
      });
      return reply.status(201).send(result);
    },
  });
};

export const getDocumentsRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['Document'],
      response: {
        200: z.array(ResponseDocumentSuccessSchema),
        500: ErrorSchema,
      },
    },
    handler: async (_, reply) => {
      const getDocumentsRepository = new GetDocumentsRepository();
      const uploadStorageUseCase = new UploadStorageUseCase();
      const getDocumentsUseCase = new GetDocumentsUseCase(
        getDocumentsRepository,
        uploadStorageUseCase
      );
      const result = await getDocumentsUseCase.execute();
      return reply.status(200).send(result);
    },
  });
};

export const updateDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      body: UpdateDocumentSchema,
      tags: ['Document'],
      response: {
        200: ResponseDocumentSuccessSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const updateDocumentRepository = new UpdateDocumentRepository();
      const getDocumentByIdRepository = new GetDocumentByIdRepository();
      const uploadStorageUseCase = new UploadStorageUseCase();
      const updateDocumentUseCase = new UpdateDocumentUseCase(
        updateDocumentRepository,
        getDocumentByIdRepository,
        uploadStorageUseCase
      );
      const file = request.body.file;

      if (file && file.mimetype !== 'application/pdf') {
        return reply.status(400).send({
          code: 'BAD_REQUEST',
          error: 'Arquivo inválido, obrigatoriamente PDF',
        });
      }

      const data = {
        ...request.body,
        file,
      };

      const result = await updateDocumentUseCase.execute(
        request.params.id,
        data
      );
      return reply.status(200).send(result);
    },
  });
};

export const updateStatusDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['Document'],
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: ResponseDocumentSuccessSchema,
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
      const uploadStorageUseCase = new UploadStorageUseCase();
      const updateStatusDocumentUseCase = new UpdateStatusDocumentUseCase(
        updateStatusDocumentRepository,
        getDocumentByIdRepository,
        uploadStorageUseCase
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
      tags: ['Document'],
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
      const uploadStorageUseCase = new UploadStorageUseCase();
      const deleteDocumentUseCase = new DeleteDocumentUseCase(
        deleteDocumentRepository,
        getDocumentByIdRepository,
        uploadStorageUseCase
      );

      await deleteDocumentUseCase.execute(request.params.id);
      return reply.status(200).send({
        message: 'Documento deletado com sucesso',
      });
    },
  });
};
