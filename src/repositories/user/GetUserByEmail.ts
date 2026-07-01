import { prisma } from '../../lib/prisma.js';
import { UserInputDTO } from '../../dtos/index.js';

export class GetUserByEmailRepository {
  async execute(email: string): Promise<UserInputDTO | null> {
    return await prisma.user.findUnique({ where: { email } });
  }
}
