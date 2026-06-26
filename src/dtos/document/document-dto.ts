import { Status } from '../../../generated/prisma/enums.js';
import { MultipartFile } from '@fastify/multipart';

export interface CreateDocumentInputDTO {
  title: {
    value: string;
  };
  description: {
    value: string;
  };
  file: MultipartFile;
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
  documentUrl: string;
  description: string;
  status: Status;
  createdAt: Date;
}

export type DocumentRepositoryDTO = Omit<DocumentOutputDTO, 'documentUrl'> & {
  documentKey: string;
};
