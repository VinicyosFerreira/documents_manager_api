import { prisma } from '../../lib/prisma.js';

export class GetUserByIdRepository {
  async execute(id: string) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }
}
