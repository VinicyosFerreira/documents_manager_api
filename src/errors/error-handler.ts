import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import {
  DocumentAlreadySignedError,
  DocumentNotFoundError,
  CpfAlreadyExistError,
  EmailAlreadyExistsError,
  UserNotFoundError,
} from './index.js';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);
  if (hasZodFastifySchemaValidationErrors(error)) {
    if (error.validationContext === 'body') {
      return reply.status(400).send({
        error: `Campo ${error.validation[0].instancePath.substring(1)}: ${error.validation[0].message}`,
        code: 'BAD_REQUEST',
      });
    }

    return reply.status(400).send({
      error: 'Há parâmetros inválidos ou faltante na requisição',
      code: 'BAD_REQUEST',
    });
  }

  if (error instanceof CpfAlreadyExistError) {
    return reply.status(409).send({
      error: 'CPF já cadastrado, tente usar outro CPF',
      code: 'CONFLICT',
    });
  }

  if (error instanceof EmailAlreadyExistsError) {
    return reply.status(409).send({
      error: 'Email já cadastrado, tente usar outro email',
      code: 'CONFLICT',
    });
  }

  if (error instanceof UserNotFoundError) {
    return reply.status(404).send({
      error: 'Usuário não encontrado',
      code: 'NOT_FOUND',
    });
  }

  if (error instanceof DocumentAlreadySignedError) {
    return reply.status(409).send({
      error: 'Documento já assinado, você não pode alterar a assinatura',
      code: 'CONFLICT',
    });
  }

  if (error instanceof DocumentNotFoundError) {
    return reply.status(404).send({
      error: 'Documento não encontrado',
      code: 'NOT_FOUND',
    });
  }

  return reply.status(500).send({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
