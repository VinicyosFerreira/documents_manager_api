import z from 'zod';
import { MultipartFile } from '@fastify/multipart';

export const CreateDocumentSchema = z.object({
  title: z.object({
    value: z.string().trim().min(1, {
      error: 'O título é obrigatório',
    }),
  }),
  description: z.object({
    value: z.string().trim().min(1, {
      error: 'A descrição e obrigatorio',
    }),
  }),
  file: z.custom<MultipartFile>(),
});

export const UpdateDocumentSchema = CreateDocumentSchema.partial();

export const ResponseDocumentSuccessSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  documentUrl: z.string(),
  status: z.enum(['PENDING', 'SIGNED']),
  createdAt: z.date(),
});

export const ResponseDeleteDocumentSchema = z.object({
  message: z.string(),
});
