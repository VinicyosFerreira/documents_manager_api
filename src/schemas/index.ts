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


export const ResponseSavePdfSchema = z.object({
  message: z.string(),
});

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const ZodErrorSchema = z.object({
  error: z.string().optional(),
  code: z.string(),
});

export const ResponseSuccessSchema = z.object({
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
