import { UpdateDocumentRepository,GetDocumentByIdRepository } from "../../repositories/index.js";
import type { DocumentOutputDTO, UpdateDocumentInputDTO } from "../../dtos/index.js";
import {DocumentNotFoundError} from "../../errors/index.js";

export class UpdateDocumentUseCase {

    private updateDocumentRepository: UpdateDocumentRepository
    private getDocumentByIdRepository: GetDocumentByIdRepository
    constructor(updateDocumentRepository: UpdateDocumentRepository, getDocumentByIdRepository: GetDocumentByIdRepository) {
        this.updateDocumentRepository = updateDocumentRepository;
        this.getDocumentByIdRepository = getDocumentByIdRepository
    }

    async execute(id: string, data: UpdateDocumentInputDTO): Promise<DocumentOutputDTO> {

        const documentById = await this.getDocumentByIdRepository.execute(id);

        if (!documentById) {
            throw new DocumentNotFoundError();
        }

        return await this.updateDocumentRepository.execute(id, data);
    }
}