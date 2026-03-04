import { prisma } from "../../lib/prisma.js";
import type { GetDocumentOutputDTO } from "../../dtos/index.js";

export class GetDocumentsRepository {
    async execute(): Promise<GetDocumentOutputDTO[]> {
        return await prisma.documento.findMany();
    }
}