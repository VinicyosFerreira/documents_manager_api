import { UpdateStatusDocumentRepository } from '../../repositories/document/UpdateStatusDocument.js';
import { GetDocumentByIdRepository } from '../../repositories/document/GetDocumentById.js';
import { UploadStorageUseCase } from '../index.js';
import type { DocumentOutputDTO } from '../../dtos/index.js';
import {
  DocumentAlreadySignedError,
  DocumentNotFoundError,
  CannotPermissionToEditDocument
} from '../../errors/index.js';

export class UpdateStatusDocumentUseCase {
  constructor(
    private updateStatusDocumentRepository: UpdateStatusDocumentRepository,
    private getDocumentByIdRepository: GetDocumentByIdRepository,
    private uploadStorageUseCase: UploadStorageUseCase
  ) {
    this.updateStatusDocumentRepository = updateStatusDocumentRepository;
    this.getDocumentByIdRepository = getDocumentByIdRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
  }
  async execute(documentId: string, userId: string): Promise<DocumentOutputDTO> {
    const documentById =
      await this.getDocumentByIdRepository.execute(documentId);

    // verificar se o documento existe
    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    // verificar se o documento pertence ao usuário
    if (documentById.userId !== userId) {
      throw new CannotPermissionToEditDocument();
    }

    // verificar se o documento já está assinado
    if (documentById.status === 'SIGNED') {
      throw new DocumentAlreadySignedError(documentById.title);
    }

    // atualizar o status
    const updatedDocument =
      await this.updateStatusDocumentRepository.execute(documentId);

    // gerar a url assinada do documento
    const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(
      updatedDocument.documentKey
    );

    return { ...updatedDocument, documentUrl: signedDocument };
  }
}
