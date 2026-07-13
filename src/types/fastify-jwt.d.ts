import '@fastify/jwt';

export type JwtPayload = {
  id: string;
  email?: string;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
