import {
  DocumentNotFoundError,
  CannotPermissionToEditDocument,
} from '../../errors/index.js';
import { DeleteDocumentRepository } from '../../repositories/document/DeleteDocument.js';
import { GetDocumentByIdRepository } from '../../repositories/document/GetDocumentById.js';
import { UploadStorageUseCase } from '../index.js';

export class DeleteDocumentUseCase {
  constructor(
    private deleteDocumentRepository: DeleteDocumentRepository,
    private getDocumentByIdRepository: GetDocumentByIdRepository,
    private uploadStorageUseCase: UploadStorageUseCase
  ) {
    this.deleteDocumentRepository = deleteDocumentRepository;
    this.getDocumentByIdRepository = getDocumentByIdRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
  }
  async execute(documentId: string, userid: string): Promise<void> {
    const documentById =
      await this.getDocumentByIdRepository.execute(documentId);

    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    if (documentById.userId !== userid) {
      throw new CannotPermissionToEditDocument();
    }

    await this.uploadStorageUseCase.deleteDocument(documentById.documentKey);

    await this.deleteDocumentRepository.execute(documentId);
  }
}
