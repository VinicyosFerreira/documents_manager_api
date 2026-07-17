import { vi } from 'vitest';
import { UserModel } from '../../../generated/prisma/models/User.js';
import {
  DocumentRepositoryDTO,
  DocumentOutputDTO,
} from '../../dtos/index.js';
import { UserNotFoundError } from '../../errors/index.js';
import { GetDocumentsByUserIdUseCase } from './GetDocumentsByUserId.js';

describe('GetDocumentsByUserIdUseCase', () => {
  const userId = 'any_userId';

  const userData: UserModel = {
    id: userId,
    name: 'any_name',
    email: 'any_email',
    cpf: 'any_cpf',
    password: 'any_password',
    createdAt: new Date(),
    deletedAt: null,
  };

  const documentData: DocumentRepositoryDTO = {
    id: 'any_documentId',
    title: 'any_title',
    description: 'any_description',
    userId,
    documentKey: 'any_documentKey',
    status: 'PENDING',
    createdAt: new Date(),
  };

  class GetDocumentsByUserIdRepositoryStub {
    async execute(): Promise<DocumentRepositoryDTO[]> {
      return [documentData];
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(): Promise<UserModel | null> {
      return userData;
    }
  }

  class UploadStorageUseCaseStub {
    async saveDocument(): Promise<{ document_key: string }> {
      return { document_key: 'any_document_key' };
    }

    async generateSignedUrl(): Promise<string> {
      return 'any_signed_url';
    }

    async deleteDocument(): Promise<{ message: string }> {
      return { message: 'any_message' };
    }
  }

  const makeSut = () => {
    const getDocumentsByUserIdRepositoryStub =
      new GetDocumentsByUserIdRepositoryStub();
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const uploadStorageUseCaseStub = new UploadStorageUseCaseStub();

    const sut = new GetDocumentsByUserIdUseCase(
      getDocumentsByUserIdRepositoryStub,
      uploadStorageUseCaseStub,
      getUserByIdRepositoryStub
    );

    return {
      sut,
      getDocumentsByUserIdRepositoryStub,
      getUserByIdRepositoryStub,
      uploadStorageUseCaseStub,
    };
  };

  it('Should get documents successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(userId);

    // assert
    const expectedDocument: DocumentOutputDTO = {
      ...documentData,
      documentUrl: 'any_signed_url',
    };
    expect(result).toEqual([expectedDocument]);
  });

  it('Should call GetUserByIdRepository with correct id', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');

    // act
    await sut.execute(userId);

    // assert
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('Should call GetDocumentsByUserIdRepository with correct id', async () => {
    // arrange
    const { sut, getDocumentsByUserIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getDocumentsByUserIdRepositoryStub, 'execute');

    // act
    await sut.execute(userId);

    // assert
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('Should call UploadStorageUseCase with correct document key', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'generateSignedUrl');

    // act
    await sut.execute(userId);

    // assert
    expect(spy).toHaveBeenCalledWith(documentData.documentKey);
  });

  it('Should return empty array when user has no documents', async () => {
    // arrange
    const { sut, getDocumentsByUserIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentsByUserIdRepositoryStub, 'execute').mockResolvedValue([]);

    // act
    const result = await sut.execute(userId);

    // assert
    expect(result).toEqual([]);
  });

  it('Should throw UserNotFoundError when user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    vi.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValue(null);

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should throw UserNotFoundError when user is deleted', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    vi.spyOn(getUserByIdRepositoryStub, 'execute').mockResolvedValue({
      ...userData,
      deletedAt: new Date(),
    });

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });
});
