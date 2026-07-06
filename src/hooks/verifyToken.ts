import { FastifyInstance } from 'fastify';
import { UnauthorizedError } from '../errors/index.js';
import { FastifyError } from 'fastify';

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

async function verifyJWT(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      console.log(err);
      if (err instanceof Error) {
        if ((err as FastifyError).name === 'FastifyError') {
          await throwErrorFromFastifyError(err as FastifyError);
        }

        throw err;
      }
    }
  });
}

export default verifyJWT;
