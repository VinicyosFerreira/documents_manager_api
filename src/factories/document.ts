import {
  CreateDocumentUseCase,
  GetDocumentsByUserIdUseCase,
  UpdateStatusDocumentUseCase,
  DeleteDocumentUseCase,
  UpdateDocumentUseCase,
  UploadStorageUseCase,
} from '../use-cases/index.js';
import {
  CreateDocumentRepository,
  GetDocumentByIdRepository,
  GetDocumentsByUserIdRepository,
  UpdateStatusDocumentRepository,
  DeleteDocumentRepository,
  UpdateDocumentRepository,
  GetUserByIdRepository,
} from '../repositories/index.js';

export const makeCreateDocument = () => {
  const createDocumentRepository = new CreateDocumentRepository();
  const uploadStorageUseCase = new UploadStorageUseCase();
  const getUserByIdRepository = new GetUserByIdRepository();
  const createDocumentUseCase = new CreateDocumentUseCase(
    createDocumentRepository,
    uploadStorageUseCase,
    getUserByIdRepository
  );
  return createDocumentUseCase;
};

export const makeGetDocumentsByUserId = () => {
  const getDocumentsByUserIdRepository = new GetDocumentsByUserIdRepository();
  const uploadStorageUseCase = new UploadStorageUseCase();
  const getUserByIdRepository = new GetUserByIdRepository();
  const getDocumentsByUserIdUseCase = new GetDocumentsByUserIdUseCase(
    getDocumentsByUserIdRepository,
    uploadStorageUseCase,
    getUserByIdRepository
  );
  return getDocumentsByUserIdUseCase;
};

export const makeUpdateDocument = () => {
  const updateDocumentRepository = new UpdateDocumentRepository();
  const getDocumentByIdRepository = new GetDocumentByIdRepository();
  const uploadStorageUseCase = new UploadStorageUseCase();
  const updateDocumentUseCase = new UpdateDocumentUseCase(
    updateDocumentRepository,
    getDocumentByIdRepository,
    uploadStorageUseCase
  );
  return updateDocumentUseCase;
};

export const makeUpdateDocumentStatus = () => {
  const updateStatusDocumentRepository = new UpdateStatusDocumentRepository();
  const getDocumentByIdRepository = new GetDocumentByIdRepository();
  const uploadStorageUseCase = new UploadStorageUseCase();
  const updateStatusDocumentUseCase = new UpdateStatusDocumentUseCase(
    updateStatusDocumentRepository,
    getDocumentByIdRepository,
    uploadStorageUseCase
  );
  return updateStatusDocumentUseCase;
};

export const makeDeleteDocument = () => {
  const deleteDocumentRepository = new DeleteDocumentRepository();
  const getDocumentByIdRepository = new GetDocumentByIdRepository();
  const uploadStorageUseCase = new UploadStorageUseCase();
  const deleteDocumentUseCase = new DeleteDocumentUseCase(
    deleteDocumentRepository,
    getDocumentByIdRepository,
    uploadStorageUseCase
  );
  return deleteDocumentUseCase;
};
