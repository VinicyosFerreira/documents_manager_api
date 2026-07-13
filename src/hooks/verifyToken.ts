import { FastifyInstance } from 'fastify';
import { FastifyError } from 'fastify';
import { throwErrorFromFastifyError } from '../utils/auth.js';

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
