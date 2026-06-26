import { GetDocumentsRepository } from '../../repositories/document/GetDocuments.js';
import {UploadStorageUseCase} from "../index.js"
import type { DocumentOutputDTO } from '../../dtos/index.js';

export class GetDocumentsUseCase {
  private uploadStorageUseCase: UploadStorageUseCase
  private getDocumentsRepository: GetDocumentsRepository
  constructor( getDocumentsRepository: GetDocumentsRepository, uploadStorageUseCase: UploadStorageUseCase) {
    this.getDocumentsRepository = getDocumentsRepository;
    this.uploadStorageUseCase = uploadStorageUseCase;
  }
  async execute(): Promise<DocumentOutputDTO[]> {
    const result = await this.getDocumentsRepository.execute();
    // const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(result[0]?.documentKey);
  
    const signedDocuments = result.map(async (document) => {
      const signedDocument = await this.uploadStorageUseCase.generateSignedUrl(document.documentKey);
      return {
        ...document,
        documentUrl: signedDocument
      };
    })

    return Promise.all(signedDocuments);
  }
}
