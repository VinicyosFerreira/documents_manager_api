import { CreateDocumentRepository } from '../../repositories/index.js';
import {UploadStorageUseCase} from "../index.js"
import type {
  CreateDocumentInputDTO,
  DocumentOutputDTO,
} from '../../dtos/index.js';

export class CreateDocumentUseCase {
  private uploadStorageUseCase: UploadStorageUseCase
  private createDocumentRepository: CreateDocumentRepository
  constructor(createDocumentRepository: CreateDocumentRepository, uploadStorageUseCase: UploadStorageUseCase) {
    this.createDocumentRepository = createDocumentRepository;
    this.uploadStorageUseCase = uploadStorageUseCase
  }
  async execute(data: CreateDocumentInputDTO): Promise<DocumentOutputDTO> {
    const storageSaved = await this.uploadStorageUseCase.saveDocument(data.file);
    const result = await this.createDocumentRepository.execute({
      ...data,
      documentKey: storageSaved.document_key,
    });

    const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(storageSaved.document_key);

    return {
      ...result,
      documentUrl: signedDocument
    };
  }
}
