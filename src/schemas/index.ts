import z from 'zod';

export const CreateDocumentSchema = z.object({
  titulo: z.string({}).trim().min(1, {
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
