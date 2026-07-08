import {
  CreateDocumentRepository,
  GetUserByIdRepository,
} from '../../repositories/index.js';
import { UploadStorageUseCase } from '../index.js';
import type {
  CreateDocumentInputDTO,
  DocumentOutputDTO,
} from '../../dtos/index.js';
import { UserNotFoundError } from '../../errors/index.js';

export class CreateDocumentUseCase {
  private uploadStorageUseCase: UploadStorageUseCase;
  private createDocumentRepository: CreateDocumentRepository;
  private getUserByIdRepository: GetUserByIdRepository;
  constructor(
    createDocumentRepository: CreateDocumentRepository,
    uploadStorageUseCase: UploadStorageUseCase,
    getUserByIdRepository: GetUserByIdRepository
  ) {
    this.createDocumentRepository = createDocumentRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(data: CreateDocumentInputDTO): Promise<DocumentOutputDTO> {
    const user = await this.getUserByIdRepository.execute(data.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const storageSaved = await this.uploadStorageUseCase.saveDocument(
      data.file
    );
    const result = await this.createDocumentRepository.execute({
      ...data,
      documentKey: storageSaved.document_key,
    });

    const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(
      storageSaved.document_key
    );

    return {
      ...result,
      documentUrl: signedDocument,
    };
  }
}
