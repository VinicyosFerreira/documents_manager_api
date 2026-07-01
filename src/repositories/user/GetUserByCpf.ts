import { prisma } from '../../lib/prisma.js';

export class GetUserByCpfRepository {
  async execute(cpf: string) {
    return await prisma.user.findUnique({ where: { cpf } });
  }
}
