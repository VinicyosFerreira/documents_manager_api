import { UpdateStatusDocumentRepository } from '../../repositories/document/UpdateStatusDocument.js';
import { GetDocumentByIdRepository } from '../../repositories/document/GetDocumentById.js';
import type { DocumentOutputDTO } from '../../dtos/index.js';
import {
  DocumentAlreadySignedError,
  DocumentNotFoundError,
} from '../../errors/index.js';

export class UpdateStatusDocumentUseCase {
  constructor(
    private updateStatusDocumentRepository: UpdateStatusDocumentRepository,
    private getDocumentByIdRepository: GetDocumentByIdRepository
  ) {}
  async execute(id: string): Promise<DocumentOutputDTO> {
    const documentById = await this.getDocumentByIdRepository.execute(id);

    // verificar se o documento existe
    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    // verificar se o documento já está assinado
    if (documentById.status === 'ASSINADO') {
      throw new DocumentAlreadySignedError(documentById.titulo);
    }

    return await this.updateStatusDocumentRepository.execute(id);
  }
}
