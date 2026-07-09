import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateDocumentSchema,
  ErrorSchema,
  UpdateDocumentSchema,
  ResponseDeleteDocumentSchema,
  ResponseDocumentSuccessSchema,
  ZodErrorSchema,
} from '../schemas/index.js';
import {
  makeCreateDocument,
  makeDeleteDocument,
  makeGetDocumentsByUserId,
  makeUpdateDocument,
  makeUpdateDocumentStatus,
} from '../factories/index.js';

export const createDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      consumes: ['multipart/form-data'],
      body: CreateDocumentSchema,
      tags: ['Document'],
      response: {
        201: ResponseDocumentSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const createDocumentUseCase = makeCreateDocument();
      const userId = request.user.id;
      const { title, description, file } = request.body;

      if (!file || file.subarray(0, 4).toString() !== '%PDF') {
        return reply.status(400).send({
          code: 'BAD_REQUEST',
          error: 'Arquivo inválido, obrigatoriamente PDF',
        });
      }

      const result = await createDocumentUseCase.execute({
        title,
        description,
        userId,
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
    handler: async (request, reply) => {
      const getDocumentsByUserIdUseCase = makeGetDocumentsByUserId();
      const userId = request.user.id;
      const result = await getDocumentsByUserIdUseCase.execute(userId);
      return reply.status(200).send(result);
    },
  });
};

export const updateDocumentRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      consumes: ['multipart/form-data'],
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
      const updateDocumentUseCase = makeUpdateDocument();
      const file = request.body.file;
      const userId = request.user.id;

      if (file && file.subarray(0, 4).toString() !== '%PDF') {
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
        userId,
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
      const updateStatusDocumentUseCase = makeUpdateDocumentStatus();
      const userId = request.user.id;
      const result = await updateStatusDocumentUseCase.execute(
        request.params.id,
        userId
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
      const deleteDocumentUseCase = makeDeleteDocument();
      const userId = request.user.id;
      await deleteDocumentUseCase.execute(request.params.id, userId);
      return reply.status(200).send({
        message: 'Documento deletado com sucesso',
      });
    },
  });
};
