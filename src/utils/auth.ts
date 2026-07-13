import { UnauthorizedError } from '../errors/index.js';
import { FastifyError } from 'fastify';
import {
  TokenError,
  TOKEN_ERROR_CODES,
  TokenValidationErrorCode,
} from 'fast-jwt';

async function throwErrorFromFastifyError(fastifyError: FastifyError) {
  const errorCodeList = [
    'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
    'FST_JWT_AUTHORIZATION_TOKEN_INVALID',
    'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED',
  ];

  if (fastifyError.code && errorCodeList.includes(fastifyError.code)) {
    throw new UnauthorizedError();
  }

  throw fastifyError;
}

function throwErrorTokenError(tokenError: TokenError) {
  console.log(tokenError);
  const ERROR_CODE_LIST = new Set<TokenValidationErrorCode>([
    TOKEN_ERROR_CODES.expired,
    TOKEN_ERROR_CODES.inactive,
    TOKEN_ERROR_CODES.invalidSignature,
    TOKEN_ERROR_CODES.malformed,
    TOKEN_ERROR_CODES.verifyError,
    TOKEN_ERROR_CODES.missingSignature,
  ]);

  if (tokenError.code && ERROR_CODE_LIST.has(tokenError.code)) {
    throw new UnauthorizedError();
  }

  throw tokenError;
}

export { throwErrorFromFastifyError, throwErrorTokenError };
