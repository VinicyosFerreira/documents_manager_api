import { Status } from '../../../generated/prisma/enums.js';

export interface CreateDocumentInputDTO {
  title: string;
  description: string;
  userId: string;
  file: Buffer;
}

export type CreateDocumentRepositoryDTO = Omit<
  CreateDocumentInputDTO,
  'file'
> & {
  documentKey: string;
};

export type UpdateDocumentInputDTO = Partial<
  CreateDocumentInputDTO & { documentKey?: string }
>;

export interface DocumentOutputDTO {
  id: string;
  title: string;
  userId: string;
  documentUrl: string;
  description: string;
  status: Status;
  createdAt: Date;
}

export type DocumentRepositoryDTO = Omit<DocumentOutputDTO, 'documentUrl'> & {
  documentKey: string;
};
