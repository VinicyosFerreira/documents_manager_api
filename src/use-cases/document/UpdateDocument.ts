import {
  UpdateDocumentRepository,
  GetDocumentByIdRepository,
} from '../../repositories/index.js';
import type {
  DocumentOutputDTO,
  UpdateDocumentInputDTO,
} from '../../dtos/index.js';
import { UploadStorageUseCase } from '../index.js';
import { DocumentNotFoundError, CannotPermissionToEditDocument } from '../../errors/index.js';

export class UpdateDocumentUseCase {
  private updateDocumentRepository: UpdateDocumentRepository;
  private getDocumentByIdRepository: GetDocumentByIdRepository;
  private uploadStorageUseCase: UploadStorageUseCase;
  constructor(
    updateDocumentRepository: UpdateDocumentRepository,
    getDocumentByIdRepository: GetDocumentByIdRepository,
    uploadStorageUseCase: UploadStorageUseCase
  ) {
    this.updateDocumentRepository = updateDocumentRepository;
    this.getDocumentByIdRepository = getDocumentByIdRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
  }

  async execute(
    documentId: string,
    userId: string,
    data: UpdateDocumentInputDTO
  ): Promise<DocumentOutputDTO> {
    const documentById =
      await this.getDocumentByIdRepository.execute(documentId);

    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    if (documentById.id !== userId) {
      throw new CannotPermissionToEditDocument();
    }

    if (data.file && documentById.status === 'SIGNED') {
      throw new DocumentNotFoundError();
    }

    if (data.file) {
      await this.uploadStorageUseCase.deleteDocument(documentById.documentKey);
      const savedDocument = await this.uploadStorageUseCase.saveDocument(
        data.file
      );
      const updatedDocument = await this.updateDocumentRepository.execute(
        documentId,
        {
          ...data,
          documentKey: savedDocument.document_key,
        }
      );

      const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(
        updatedDocument.documentKey
      );

      return { ...updatedDocument, documentUrl: signedDocument };
    }

    const updatedDocument = await this.updateDocumentRepository.execute(
      documentId,
      data
    );

    const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(
      updatedDocument.documentKey
    );

    return { ...updatedDocument, documentUrl: signedDocument };
  }
}
