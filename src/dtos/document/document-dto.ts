import { Status } from "../../../generated/prisma/enums.js";

export interface CreateDocumentInputDTO {
  titulo: string;
  descricao: string;
}

export interface DocumentOutputDTO {
  id: string;
  titulo: string;
  descricao: string;
  status: Status;
  criado_em: Date;
}
