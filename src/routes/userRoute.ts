import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  CreateUserRepository,
  GetUserByCpfRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from '../repositories/index.js';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '../use-cases/index.js';
import {
  CreateUserSchema,
  ErrorSchema,
  ZodErrorSchema,
  UpdateUserSchema,
  ResponseUserSuccessSchema,
} from '../schemas/index.js';

export const createUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      body: CreateUserSchema,
      tags: ['User'],
      response: {
        201: ResponseUserSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const createUserRepository = new CreateUserRepository();
      const getUserByEmailRepository = new GetUserByEmailRepository();
      const getUserByCpfRepository = new GetUserByCpfRepository();
      const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
        getUserByCpfRepository
      );
      const result = await createUserUseCase.execute(request.body);
      return reply.status(201).send(result);
    },
  });
};

export const getUserByIdRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['User'],
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: ResponseUserSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const getUserByIdRepository = new GetUserByIdRepository();
      const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
      const result = await getUserByIdUseCase.execute(request.params.id);
      return reply.status(200).send(result);
    },
  });
};

export const updateUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['User'],
      params: z.object({
        id: z.uuid(),
      }),
      body: UpdateUserSchema,
      response: {
        200: ResponseUserSuccessSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const updateUserRepository = new UpdateUserRepository();
      const getUserByIdRepository = new GetUserByIdRepository();
      const getUserByEmailRepository = new GetUserByEmailRepository();
      const getUserByCpfRepository = new GetUserByCpfRepository();
      const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByIdRepository,
        getUserByEmailRepository,
        getUserByCpfRepository
      );
      const result = await updateUserUseCase.execute(
        request.params.id,
        request.body
      );
      return reply.status(200).send(result);
    },
  });
};
