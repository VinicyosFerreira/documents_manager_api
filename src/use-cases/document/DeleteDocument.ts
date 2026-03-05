import { DocumentNotFoundError } from '../../errors/index.js';
import { DeleteDocumentRepository } from '../../repositories/document/DeleteDocument.js';
import { GetDocumentByIdRepository } from '../../repositories/document/GetDocumentById.js';

export class DeleteDocumentUseCase {
  constructor(
    private deleteDocumentRepository: DeleteDocumentRepository,
    private getDocumentByIdRepository: GetDocumentByIdRepository
  ) {
    this.deleteDocumentRepository = deleteDocumentRepository;
    this.getDocumentByIdRepository = getDocumentByIdRepository;
  }
  async execute(id: string): Promise<void> {
    const documentById = await this.getDocumentByIdRepository.execute(id);

    if (!documentById) {
      throw new DocumentNotFoundError();
    }

    await this.deleteDocumentRepository.execute(id);
  }
}
