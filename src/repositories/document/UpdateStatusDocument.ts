import { prisma } from '../../lib/prisma.js';
import type { DocumentRepositoryDTO } from '../../dtos/index.js';

export class UpdateStatusDocumentRepository {
  async execute(id: string): Promise<DocumentRepositoryDTO> {
    return await prisma.document.update({
      where: {
        id: id,
      },
      data: {
        status: 'SIGNED',
      },
    });
  }
}
