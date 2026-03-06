import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { DocumentAlreadySignedError, DocumentNotFoundError } from './index.js';

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    if (error.validationContext === 'body') {
      return reply.status(400).send({
        error: error.validation.map((v) => v.message).join(''),
        code: 'BAD_REQUEST',
      });
    }

    return reply.status(400).send({
      error: error.validation.map((v) => v.message).join(''),
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
