import { GetDocumentsRepository } from '../../repositories/document/GetDocuments.js';
import type { GetDocumentOutputDTO } from '../../dtos/index.js';

export class GetDocumentsUseCase {
  constructor(private getDocumentsRepository: GetDocumentsRepository) {
    this.getDocumentsRepository = getDocumentsRepository;
  }
  async execute(): Promise<GetDocumentOutputDTO[]> {
    const result = await this.getDocumentsRepository.execute();
    return result;
  }
}
