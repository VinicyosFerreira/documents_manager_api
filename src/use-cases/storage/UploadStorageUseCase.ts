import 'dotenv/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

export class UploadStorageUseCase {
  private s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.MINIO_ROOT_USER || '',
        secretAccessKey: process.env.MINIO_ROOT_PASSWORD || '',
      },
      forcePathStyle: true,
    });
  }
  async saveDocument(file: Buffer) {
    const uniqueFileName = crypto.randomUUID() + '.pdf';

    const save = new PutObjectCommand({
      Bucket: 'documents',
      Key: uniqueFileName,
      Body: file,
      ContentType: 'application/pdf',
    });

    try {
      await this.s3Client.send(save);
      return {
        document_key: `${uniqueFileName}`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateSignedUrl(documentKey: string) {
    const command = new GetObjectCommand({
      Bucket: 'documents',
      Key: documentKey,
    });
    try {
      const signed = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return signed;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteDocument(documentKey: string) {
    const command = new DeleteObjectCommand({
      Bucket: 'documents',
      Key: documentKey,
    });

    try {
      await this.s3Client.send(command);
      return {
        message: 'Documento deletado com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
