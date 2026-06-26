import { prisma } from '../../lib/prisma.js';

export class GetDocumentByIdRepository {
  async execute(id: string) {
    return await prisma.document.findUnique({
      where: {
        id: id,
      },
    });
  }
}
