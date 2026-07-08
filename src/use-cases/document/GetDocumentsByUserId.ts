import {
  GetDocumentsByUserIdRepository,
  GetUserByIdRepository,
} from '../../repositories/index.js';
import { UploadStorageUseCase } from '../index.js';
import type { DocumentOutputDTO } from '../../dtos/index.js';
import { UserNotFoundError } from '../../errors/index.js';

export class GetDocumentsByUserIdUseCase {
  private uploadStorageUseCase: UploadStorageUseCase;
  private getDocumentsByUserIdRepository: GetDocumentsByUserIdRepository;
  private getUserByIdRepository: GetUserByIdRepository;
  constructor(
    getDocumentsRepository: GetDocumentsByUserIdRepository,
    uploadStorageUseCase: UploadStorageUseCase,
    getUserByIdRepository: GetUserByIdRepository
  ) {
    this.getDocumentsByUserIdRepository = getDocumentsRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(userId: string): Promise<DocumentOutputDTO[]> {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const documents = await this.getDocumentsByUserIdRepository.execute(userId);

    if (documents.length === 0) {
      return [];
    }

    const signedDocuments = documents.map(async (document) => {
      const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(
        document.documentKey
      );
      return {
        ...document,
        documentUrl: signedDocument,
      };
    });

    return Promise.all(signedDocuments);
  }
}
