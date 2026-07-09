import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  CreateUserSchema,
  ErrorSchema,
  ZodErrorSchema,
  UpdateUserSchema,
  ResponseUserSuccessSchema,
  ResponseDeleteUserSuccessSchema,
  LoginUserSchema,
  LoginUserResponseSchema,
} from '../schemas/index.js';
import {
  makeCreateUser,
  makeLoginUser,
  makeGetUserById,
  makeUpdateUser,
  makeDeleteUser,
} from '../factories/index.js';

export const loginUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['User'],
      body: LoginUserSchema,
      response: {
        200: LoginUserResponseSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const loginUserUseCase = makeLoginUser();
      const result = await loginUserUseCase.execute(
        request.body.email,
        request.body.password
      );

      const token = app.jwt.sign({ id: result.id, email: result.email });

      const payload = {
        user: result,
        token,
      };

      return reply.status(200).send(payload);
    },
  });
};

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
      const createUserUseCase = makeCreateUser();
      const result = await createUserUseCase.execute(request.body);
      return reply.status(201).send(result);
    },
  });
};

export const getUserByIdRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['User'],
      response: {
        200: ResponseUserSuccessSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const getUserByIdUseCase = makeGetUserById();
      const userId = request.user.id;
      const result = await getUserByIdUseCase.execute(userId);
      return reply.status(200).send(result);
    },
  });
};

export const updateUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/',
    schema: {
      tags: ['User'],
      body: UpdateUserSchema,
      response: {
        200: ResponseUserSuccessSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const updateUserUseCase = makeUpdateUser();
      const userId = request.user.id;
      const result = await updateUserUseCase.execute(userId, request.body);
      return reply.status(200).send(result);
    },
  });
};

export const deleteUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'DELETE',
    url: '/',
    schema: {
      tags: ['User'],
      response: {
        200: ResponseDeleteUserSuccessSchema,
        400: ZodErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const deleteUserUseCase = makeDeleteUser();
      const userId = request.user.id;
      await deleteUserUseCase.execute(userId);
      return reply
        .status(200)
        .send({ message: 'Usuário deletado com sucesso' });
    },
  });
};
