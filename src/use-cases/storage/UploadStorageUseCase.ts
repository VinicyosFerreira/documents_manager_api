import { s3Client } from '../../lib/s3.js';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

export class UploadStorageUseCase {
  async saveDocument(file: Buffer) {
    const uniqueFileName = crypto.randomUUID() + '.pdf';

    const save = new PutObjectCommand({
      Bucket: 'documents',
      Key: uniqueFileName,
      Body: file,
      ContentType: 'application/pdf',
    });

    try {
      await s3Client.send(save);
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
      const signed = await getSignedUrl(s3Client, command, {
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
      await s3Client.send(command);
      return {
        message: 'Documento deletado com sucesso',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
