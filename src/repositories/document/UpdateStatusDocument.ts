import { prisma } from '../../lib/prisma.js';
import type { DocumentOutputDTO } from '../../dtos/index.js';

export class UpdateStatusDocumentRepository {
  async execute(id: string): Promise<DocumentOutputDTO> {
    return await prisma.documento.update({
      where: {
        id: id,
      },
      data: {
        status: 'ASSINADO',
      },
    });
  }
}
