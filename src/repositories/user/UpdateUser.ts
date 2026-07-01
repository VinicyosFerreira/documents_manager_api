import { prisma } from '../../lib/prisma.js';
import { UserUpdateInputDTO } from '../../dtos/index.js';

export class UpdateUserRepository {
  async updateUser(userId: string, userData: UserUpdateInputDTO) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    return updatedUser;
  }
}
