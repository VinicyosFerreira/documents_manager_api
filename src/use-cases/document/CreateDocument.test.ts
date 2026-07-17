import {
  CreateDocumentInputDTO,
  DocumentRepositoryDTO,
} from '../../dtos/index.js';
import { UserModel } from '../../../generated/prisma/models/User.js';
import { CreateDocumentUseCase } from './CreateDocument.js';
import { UserNotFoundError } from '../../errors/index.js';

describe('CreateDocumentUseCase', () => {
  const documentDataInput: CreateDocumentInputDTO = {
    title: 'any_title',
    description: 'any_description',
    userId: 'any_userId',
    file: Buffer.from('any_file'),
  };

  const documentDataOutput: DocumentRepositoryDTO = {
    id: 'any_id',
    description: 'any_description',
    title: 'any_title',
    userId: 'any_userId',
    documentKey: 'any_documentKey',
    status: 'PENDING',
    createdAt: new Date(),
  };

  const userData = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    cpf: 'any_cpf',
    password: 'any_password',
    createdAt: new Date(),
    deletedAt: null,
  };

  class UploadStorageUseCaseStub {
    async saveDocument(file: Buffer): Promise<{ document_key: string }> {
      void file;
      return { document_key: 'any_document_key' };
    }
    async generateSignedUrl(file: string): Promise<string> {
      void file;
      return 'any_signed_url';
    }
    async deleteDocument(file: string): Promise<{ message: string }> {
      void file;
      return { message: 'any_message' };
    }
  }

  class CreateDocumentRepository {
    async execute(): Promise<DocumentRepositoryDTO> {
      return documentDataOutput;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return userData;
    }
  }

  const makeSut = () => {
    const uploadStorageUseCaseStub = new UploadStorageUseCaseStub();
    const createDocumentRepositoryStub = new CreateDocumentRepository();
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();

    const sut = new CreateDocumentUseCase(
      createDocumentRepositoryStub,
      uploadStorageUseCaseStub,
      getUserByIdRepositoryStub
    );

    return {
      sut,
      uploadStorageUseCaseStub,
      createDocumentRepositoryStub,
      getUserByIdRepositoryStub,
    };
  };

  it('Should create document successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(documentDataInput);

    // assert
    expect(result).toMatchObject(documentDataOutput);
    expect(result.documentUrl).toBe('any_signed_url');
  });

  it('Should call GetUserByIdRepository with correct id', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');

    // act
    await sut.execute(documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(documentDataInput.userId);
  });

  it('Should throw UserNotFoundError when user is not found', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    vi.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValueOnce(null);

    // act
    const promise = sut.execute(documentDataInput);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should call UploadStorageUseCase with correct file', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'saveDocument');

    // act
    await sut.execute(documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(documentDataInput.file);
  });

  it('Should call createDocumentRepository with correct params', async () => {
    // arrange
    const { sut, createDocumentRepositoryStub } = makeSut();
    const spy = vi.spyOn(createDocumentRepositoryStub, 'execute');

    // act
    await sut.execute(documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith({
      ...documentDataInput,
      documentKey: 'any_document_key',
    });
  });

  it('Should call UploadStorageUseCase with correct file', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'generateSignedUrl');

    // act
    await sut.execute(documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith('any_document_key');
  });

});
