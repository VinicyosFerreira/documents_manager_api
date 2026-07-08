import { prisma } from '../../lib/prisma.js';
import type {
  CreateDocumentRepositoryDTO,
  DocumentRepositoryDTO,
} from '../../dtos/index.js';

export class CreateDocumentRepository {
  async execute(
    data: CreateDocumentRepositoryDTO
  ): Promise<DocumentRepositoryDTO> {
    return await prisma.document.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        documentKey: data.documentKey,
      },
    });
  }
}
