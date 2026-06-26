import { prisma } from "../../lib/prisma.js";
import type { DocumentRepositoryDTO } from "../../dtos/index.js";

export class GetDocumentsRepository {
    async execute(): Promise<DocumentRepositoryDTO[]> {
        return await prisma.document.findMany();
    }
}