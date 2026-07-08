import z from 'zod';
export const CreateDocumentSchema = z.object({
  title: z
    .string({
      error: 'O título é obrigatório',
    })
    .trim()
    .min(1, {
      error: 'O título é obrigatório',
    }),
  description: z
    .string({
      error: 'A descrição é obrigatória',
    })
    .trim()
    .min(1, {
      error: 'A descrição é obrigatória',
    }),
  file: z.instanceof(Buffer , {
    error: 'O arquivo é obrigatório',
  }),
});

export const UpdateDocumentSchema = CreateDocumentSchema.partial();

export const ResponseDocumentSuccessSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  documentUrl: z.string(),
  status: z.enum(['PENDING', 'SIGNED']),
  createdAt: z.date(),
});

export const ResponseDeleteDocumentSchema = z.object({
  message: z.string(),
});
