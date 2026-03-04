import { prisma } from '../../lib/prisma.js';
import type {
  CreateDocumentInputDTO,
  CreateDocumentOutputDTO,
} from '../../dtos/index.js';

export class CreateDocumentRepository {
  async execute(
    data: CreateDocumentInputDTO
  ): Promise<CreateDocumentOutputDTO> {
    return await prisma.documento.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
      },
    });
  }
}
