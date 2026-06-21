import {prisma} from '../../lib/prisma.js'
import type { DocumentOutputDTO, UpdateDocumentInputDTO } from '../../dtos/index.js';

export class UpdateDocumentRepository {
    async execute(id: string, data: UpdateDocumentInputDTO): Promise<DocumentOutputDTO> {
        return await prisma.documento.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
}