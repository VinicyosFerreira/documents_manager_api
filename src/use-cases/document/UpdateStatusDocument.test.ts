import { vi } from 'vitest';
import { DocumentModel } from '../../../generated/prisma/models/Document.js';
import {
  DocumentOutputDTO,
  DocumentRepositoryDTO,
} from '../../dtos/index.js';
import {
  CannotPermissionToEditDocument,
  DocumentAlreadySignedError,
  DocumentNotFoundError,
} from '../../errors/index.js';
import { UpdateStatusDocumentUseCase } from './UpdateStatusDocument.js';

describe('UpdateStatusDocumentUseCase', () => {
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

  const signedDocumentData: DocumentRepositoryDTO = {
    ...documentData,
    status: 'SIGNED',
  };

  class UpdateStatusDocumentRepositoryStub {
    async execute(): Promise<DocumentRepositoryDTO> {
      return signedDocumentData;
    }
  }

  class GetDocumentByIdRepositoryStub {
    async execute(): Promise<DocumentModel | null> {
      return documentData;
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
    const updateStatusDocumentRepositoryStub =
      new UpdateStatusDocumentRepositoryStub();
    const getDocumentByIdRepositoryStub = new GetDocumentByIdRepositoryStub();
    const uploadStorageUseCaseStub = new UploadStorageUseCaseStub();

    const sut = new UpdateStatusDocumentUseCase(
      updateStatusDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub
    );

    return {
      sut,
      updateStatusDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub,
    };
  };

  it('Should sign document successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(documentId, userId);

    // assert
    const expectedDocument: DocumentOutputDTO = {
      ...signedDocumentData,
      documentUrl: 'any_signed_url',
    };
    expect(result).toEqual(expectedDocument);
  });

  it('Should call GetDocumentByIdRepository with correct id', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getDocumentByIdRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId);

    // assert
    expect(spy).toHaveBeenCalledWith(documentId);
  });

  it('Should call UpdateStatusDocumentRepository with correct id', async () => {
    // arrange
    const { sut, updateStatusDocumentRepositoryStub } = makeSut();
    const spy = vi.spyOn(updateStatusDocumentRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId);

    // assert
    expect(spy).toHaveBeenCalledWith(documentId);
  });

  it('Should call UploadStorageUseCase with correct document key', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'generateSignedUrl');

    // act
    await sut.execute(documentId, userId);

    // assert
    expect(spy).toHaveBeenCalledWith(signedDocumentData.documentKey);
  });

  it('Should throw DocumentNotFoundError when document does not exist', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentByIdRepositoryStub, 'execute').mockResolvedValue(null);

    // act
    const promise = sut.execute(documentId, userId);

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
    const promise = sut.execute(documentId, userId);

    // assert
    await expect(promise).rejects.toThrow(
      new CannotPermissionToEditDocument()
    );
  });

  it('Should throw DocumentAlreadySignedError when document is already signed', async () => {
    // arrange
    const { sut, getDocumentByIdRepositoryStub } = makeSut();
    vi.spyOn(getDocumentByIdRepositoryStub, 'execute').mockResolvedValue({
      ...documentData,
      status: 'SIGNED',
    });

    // act
    const promise = sut.execute(documentId, userId);

    // assert
    await expect(promise).rejects.toThrow(
      new DocumentAlreadySignedError(documentData.title)
    );
  });
});
