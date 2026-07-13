import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  CreateUserSchema,
  ErrorSchema,
  ZodErrorSchema,
  UpdateUserSchema,
  ResponseUserSuccessSchema,
  ResponseDeleteUserSuccessSchema,
  RefreshTokenSchema,
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
import { UnauthorizedError } from '../errors/index.js';
import { TokenError } from 'fast-jwt';
import { throwErrorTokenError } from '../utils/auth.js';
import { JwtPayload } from '../types/fastify-jwt.js';

export const loginUserRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/login',
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

      // gerar o access token
      const token = app.jwt.sign({ id: result.id, email: result.email});

      // gerar o refresh token
      const refreshToken = app.jwt.sign({ id: result.id }, { expiresIn: '15d' });

      // salvar no cookie
      reply.setCookie('refreshToken', refreshToken, {
        maxAge: 15 * 24 * 60 * 60,
      });

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

export const refreshTokenRoute = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/refresh',
    schema: {
      tags: ['User'],
      response: {
        200: RefreshTokenSchema,
        400: ZodErrorSchema,
        500: ErrorSchema,
        401: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError();
      }

      const unsignedCooie = request.unsignCookie(refreshToken);

      if (!unsignedCooie.valid) {
        throw new UnauthorizedError();
      }

      try {
        const validateRefreshToken = app.jwt.verify<JwtPayload>(
          unsignedCooie.value
        );

        const accessToken = app.jwt.sign({
          id: validateRefreshToken.id,
          email: validateRefreshToken.email,
        });

        const result = {
          accessToken,
        };

        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof TokenError) {
          throwErrorTokenError(error);
        }

        throw error;
      }
    },
  });
};
