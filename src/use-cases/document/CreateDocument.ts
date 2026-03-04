import { CreateDocumentRepository } from '../../repositories/index.js';
import type {
  CreateDocumentInputDTO,
  CreateDocumentOutputDTO,
} from '../../dtos/index.js';
export class CreateDocumentUseCase {
  constructor(private createDocumentRepository: CreateDocumentRepository) {
    this.createDocumentRepository = createDocumentRepository;
  }
  async execute(dto: CreateDocumentInputDTO): Promise<CreateDocumentOutputDTO> {
    const result = await this.createDocumentRepository.execute(dto);
    return result;
  }
}
