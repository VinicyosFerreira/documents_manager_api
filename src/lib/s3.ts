import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:9000',
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || '',
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
  },
  forcePathStyle: true,
});

export { s3Client };
