import { prisma } from '../../lib/prisma.js';
import type {
  CreateDocumentRepositoryDTO,
  DocumentRepositoryDTO,
} from '../../dtos/index.js';

export class CreateDocumentRepository {
  async execute(data: CreateDocumentRepositoryDTO): Promise<DocumentRepositoryDTO> {
    return await prisma.document.create({
      data: {
        title: data.title.value,
        description: data.description.value,
        documentKey: data.documentKey,
      },
    });
  }
}
