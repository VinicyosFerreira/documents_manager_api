import { GetDocumentsRepository } from '../../repositories/document/GetDocuments.js';
import type { DocumentOutputDTO } from '../../dtos/index.js';

export class GetDocumentsUseCase {
  constructor(private getDocumentsRepository: GetDocumentsRepository) {
    this.getDocumentsRepository = getDocumentsRepository;
  }
  async execute(): Promise<DocumentOutputDTO[]> {
    const result = await this.getDocumentsRepository.execute();
    return result;
  }
}
