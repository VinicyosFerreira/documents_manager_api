import z from 'zod';

export const CreateDocumentSchema = z.object({
  titulo: z.string().trim().min(1, {
    message: 'O título é obrigatório',
  }),
  descricao: z.string().trim().min(1, {
    message: 'A descrição é obrigatória',
  }),
});

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const ZodErrorSchema = z.object({
  error: z.string().optional(),
  code: z.string(),
})

export const ResponseSuccessSchema = z.object({
  id: z.uuid(),
  titulo: z.string().trim().min(1),
  descricao: z.string().trim().min(1),
  status: z.enum(['PENDENTE', 'ASSINADO']),
  criado_em: z.date(),
});

export const ResponseDeleteDocumentSchema = z.object({
  message: z.string(),
});