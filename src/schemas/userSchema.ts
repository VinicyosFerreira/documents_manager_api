import z from 'zod';

const validateCpf = (value: string) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(value);
};

export const CreateUserSchema = z.object({
  name: z.string().trim().min(1, {
    error: 'O nome e obrigatório',
  }),
  cpf: z
    .string()
    .trim()
    .min(1, {
      error: 'O CPF é obrigatório',
    })
    .refine((value) => validateCpf(value), {
      message: 'O CPF é inválido, utilize o formato 000.000.000-00',
    }),
  email: z
    .email({
      error: 'O email é inválido',
    })
    .trim()
    .min(1, {
      error: 'O email e obrigatório',
    }),
  password: z.string().trim().min(8, {
    error: 'A senha precisa ter no mínimo 8 caracteres',
  }),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const ResponseUserSuccessSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  cpf: z.string().trim().min(1),
  email: z.string().trim().min(1),
  createdAt: z.date(),
});

export const ResponseDeleteUserSuccessSchema = z.object({
  message: z.string(),
});

export const LoginUserSchema = z.object({
  email: z
    .email({
      error: 'O email é inválido',
    })
    .trim()
    .min(1, {
      error: 'O email é obrigatório',
    }),
  password: z.string().trim().min(8, {
    error: 'A senha precisa ter no mínimo 8 caracteres',
  }),
});

export const LoginUserResponseSchema = z.object({
  token: z.string(),
  user: ResponseUserSuccessSchema,
});
