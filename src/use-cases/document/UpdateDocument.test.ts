import { vi } from 'vitest';
import { DocumentModel } from '../../../generated/prisma/models/Document.js';
import {
  DocumentOutputDTO,
  DocumentRepositoryDTO,
  UpdateDocumentInputDTO,
} from '../../dtos/index.js';
import {
  CannotPermissionToEditDocument,
  DocumentAlreadySignedError,
  DocumentNotFoundError,
} from '../../errors/index.js';
import { UpdateDocumentUseCase } from './UpdateDocument.js';

describe('UpdateDocumentUseCase', () => {
  const documentId = 'any_documentId';
  const userId = 'any_userId';

  const documentData: DocumentModel = {
    id: documentId,
    title: 'any_title',
    description: 'any_description',
    userId,
    documentKey: 'any_documentKey',
    status: 'PENDING',
    createdAt: new Date(),
  };

  const documentDataInput: UpdateDocumentInputDTO = {
    title: 'updated_title',
    description: 'updated_description',
  };

  class UpdateDocumentRepositoryStub {
    async execute(
      id: string,
      data: UpdateDocumentInputDTO
    ): Promise<DocumentRepositoryDTO> {
      return {
        ...documentData,
        ...data,
        id,
      };
    }
  }

  class GetDocumentByIdRepositoryStub {
    async execute(): Promise<DocumentModel | null> {
      return documentData;
    }
  }

  class UploadStorageUseCaseStub {
    async saveDocument(): Promise<{ document_key: string }> {
      return { document_key: 'updated_documentKey' };
    }

    async generateSignedUrl(): Promise<string> {
      return 'any_signed_url';
    }

    async deleteDocument(): Promise<{ message: string }> {
      return { message: 'any_message' };
    }
  }

  const makeSut = () => {
    const updateDocumentRepositoryStub = new UpdateDocumentRepositoryStub();
    const getDocumentByIdRepositoryStub = new GetDocumentByIdRepositoryStub();
    const uploadStorageUseCaseStub = new UploadStorageUseCaseStub();

    const sut = new UpdateDocumentUseCase(
      updateDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub
    );

    return {
      sut,
      updateDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub,
    };
  };

  it('Should update document successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(documentId, userId, documentDataInput);

    // assert
    const expectedDocument: DocumentOutputDTO = {
      ...documentData,
      ...documentDataInput,
      documentUrl: 'any_signed_url',
    };
    expect(result).toEqual(expectedDocument);
  });

  it('Should call GetDocumentByIdRepository with correct id', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getDocumentByIdRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId, documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(documentId);
  });

  it('Should call UpdateDocumentRepository with correct data', async () => {
    // arrange
    const { sut, updateDocumentRepositoryStub } = makeSut();
    const spy = vi.spyOn(updateDocumentRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId, documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(documentId, documentDataInput);
  });

  it('Should call UploadStorageUseCase with correct document key', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'generateSignedUrl');

    // act
    await sut.execute(documentId, userId, documentDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(documentData.documentKey);
  });

  it('Should replace file successfully', async () => {
    // arrange
    const { sut, updateDocumentRepositoryStub, uploadStorageUseCaseStub } =
      makeSut();
    const file = Buffer.from('any_file');
    const deleteSpy = vi.spyOn(uploadStorageUseCaseStub, 'deleteDocument');
    const saveSpy = vi.spyOn(uploadStorageUseCaseStub, 'saveDocument');
    const updateSpy = vi.spyOn(updateDocumentRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId, { file });

    // assert
    expect(deleteSpy).toHaveBeenCalledWith(documentData.documentKey);
    expect(saveSpy).toHaveBeenCalledWith(file);
    expect(updateSpy).toHaveBeenCalledWith(documentId, {
      file,
      documentKey: 'updated_documentKey',
    });
  });

  it('Should throw DocumentNotFoundError when document does not exist', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentByIdRepositoryStub, 'execute').mockResolvedValue(null);

    // act
    const promise = sut.execute(documentId, userId, documentDataInput);

    // assert
    await expect(promise).rejects.toThrow(new DocumentNotFoundError());
  });

  it('Should throw CannotPermissionToEditDocument when document belongs to another user', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentByIdRepositoryStub, 'execute').mockResolvedValue({
      ...documentData,
      userId: 'another_userId',
    });

    // act
    const promise = sut.execute(documentId, userId, documentDataInput);

    // assert
    await expect(promise).rejects.toThrow(
      new CannotPermissionToEditDocument()
    );
  });

  it('Should throw DocumentAlreadySignedError when replacing signed document file', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentByIdRepositoryStub, 'execute').mockResolvedValue({
      ...documentData,
      status: 'SIGNED',
    });

    // act
    const promise = sut.execute(documentId, userId, {
      file: Buffer.from('any_file'),
    });

    // assert
    await expect(promise).rejects.toThrow(
      new DocumentAlreadySignedError(documentData.title)
    );
  });
});
