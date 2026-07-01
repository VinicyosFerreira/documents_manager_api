import z from 'zod';

export const ErrorSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const ZodErrorSchema = z.object({
  error: z.string().optional(),
  code: z.string(),
});