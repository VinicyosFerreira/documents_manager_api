import { prisma } from '../../lib/prisma.js';
import type {
  CreateDocumentInputDTO,
  DocumentOutputDTO
} from '../../dtos/index.js';

export class CreateDocumentRepository {
  async execute(
    data: CreateDocumentInputDTO
  ): Promise<DocumentOutputDTO> {
    return await prisma.documento.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
      },
    });
  }
}
