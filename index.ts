import 'dotenv/config';
import app from './src/app.js';

try {
  await app.listen({
    port: Number(process.env.PORT) || 8080,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}