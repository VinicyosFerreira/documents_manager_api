import { Status } from '../../../generated/prisma/enums.js';

export interface GetDocumentOutputDTO {
  id: string;
  titulo: string;
  descricao: string;
  status: Status;
  criado_em: Date;
}
