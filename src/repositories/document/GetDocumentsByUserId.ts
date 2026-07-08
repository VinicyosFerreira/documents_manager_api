import { prisma } from "../../lib/prisma.js";
import type { DocumentRepositoryDTO } from "../../dtos/index.js";

export class GetDocumentsByUserIdRepository {
    async execute( userId: string): Promise<DocumentRepositoryDTO[]> {
        return await prisma.document.findMany({
            where: {
                userId,
            }
        });
    }
}