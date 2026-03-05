import { prisma } from '../../lib/prisma.js';

export class DeleteDocumentRepository {
  async execute(id: string): Promise<void> {
    await prisma.documento.delete({
      where: {
        id,
      },
    });
  }
}
