import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { DocumentAlreadySignedError, DocumentNotFoundError } from './index.js';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);
  if (hasZodFastifySchemaValidationErrors(error)) {
    if (error.validationContext === 'body') {
      return reply.status(400).send({
        error: `Campo ${error.validation[0].instancePath.substring(1)} é obrigatório ou está inválido`,
        code: 'BAD_REQUEST',
      });
    }

    return reply.status(400).send({
      error: 'Há parâmetros inválidos ou faltante na requisição',
      code: 'BAD_REQUEST',
    });
  }

  if (error instanceof DocumentAlreadySignedError) {
    return reply.status(403).send({
      error:
        'Documento já assinado, você não tem permissão para alterar o status',
      code: 'FORBIDDEN',
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
