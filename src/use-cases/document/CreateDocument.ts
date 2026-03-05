import { CreateDocumentRepository } from '../../repositories/index.js';
import type {
  CreateDocumentInputDTO,
  DocumentOutputDTO,
} from '../../dtos/index.js';
export class CreateDocumentUseCase {
  constructor(private createDocumentRepository: CreateDocumentRepository) {
    this.createDocumentRepository = createDocumentRepository;
  }
  async execute(dto: CreateDocumentInputDTO): Promise<DocumentOutputDTO> {
    const result = await this.createDocumentRepository.execute(dto);
    return result;
  }
}
