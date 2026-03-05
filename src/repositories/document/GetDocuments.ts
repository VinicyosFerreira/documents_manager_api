import { prisma } from "../../lib/prisma.js";
import type { DocumentOutputDTO } from "../../dtos/index.js";

export class GetDocumentsRepository {
    async execute(): Promise<DocumentOutputDTO[]> {
        return await prisma.documento.findMany();
    }
}