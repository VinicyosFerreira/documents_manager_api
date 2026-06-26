import { DocumentNotFoundError } from '../../errors/index.js';
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
  async execute(id: string): Promise<void> {
    const documentById = await this.getDocumentByIdRepository.execute(id);

    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    await this.uploadStorageUseCase.deleteDocument(documentById.documentKey);

    await this.deleteDocumentRepository.execute(id);
  }
}
