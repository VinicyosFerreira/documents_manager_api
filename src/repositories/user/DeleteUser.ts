import { prisma } from '../../lib/prisma.js';
import { UserOutputDTO } from '../../dtos/index.js';

export class DeleteUserRepository {
  async execute(userId: string): Promise<UserOutputDTO> {
    return await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
