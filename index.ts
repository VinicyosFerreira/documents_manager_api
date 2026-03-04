import Fastify from 'fastify';

const app = Fastify();

app.get('/', async () => {
  return { hello: 'world' };
});

try {
  await app.listen({
    port: 8000,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
