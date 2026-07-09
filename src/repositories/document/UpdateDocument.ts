import {prisma} from '../../lib/prisma.js'
import type {  DocumentRepositoryDTO, UpdateDocumentInputDTO } from '../../dtos/index.js';

export class UpdateDocumentRepository {
    async execute(id: string, data: UpdateDocumentInputDTO): Promise<DocumentRepositoryDTO> {
        return await prisma.document.update({
            where: {
                id: id,
            },
            data: {
                title: data.title,
                description: data.description,
                documentKey: data.documentKey
            },
        });
    }
}