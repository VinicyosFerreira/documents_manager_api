import { vi } from 'vitest';
import { DocumentModel } from '../../../generated/prisma/models/Document.js';
import {
  CannotPermissionToEditDocument,
  DocumentNotFoundError,
} from '../../errors/index.js';
import { DeleteDocumentUseCase } from './DeleteDocument.js';

describe('DeleteDocumentUseCase', () => {
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

  class DeleteDocumentRepositoryStub {
    async execute(): Promise<void> {}
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
    const deleteDocumentRepositoryStub = new DeleteDocumentRepositoryStub();
    const getDocumentByIdRepositoryStub = new GetDocumentByIdRepositoryStub();
    const uploadStorageUseCaseStub = new UploadStorageUseCaseStub();

    const sut = new DeleteDocumentUseCase(
      deleteDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub
    );

    return {
      sut,
      deleteDocumentRepositoryStub,
      getDocumentByIdRepositoryStub,
      uploadStorageUseCaseStub,
    };
  };

  it('Should delete document successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(documentId, userId);

    // assert
    expect(result).toBeUndefined();
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

  it('Should call UploadStorageUseCase with correct document key', async () => {
    // arrange
    const { sut, uploadStorageUseCaseStub } = makeSut();
    const spy = vi.spyOn(uploadStorageUseCaseStub, 'deleteDocument');

    // act
    await sut.execute(documentId, userId);

    // assert
    expect(spy).toHaveBeenCalledWith(documentData.documentKey);
  });

  it('Should call DeleteDocumentRepository with correct id', async () => {
    // arrange
    const { sut, deleteDocumentRepositoryStub } = makeSut();
    const spy = vi.spyOn(deleteDocumentRepositoryStub, 'execute');

    // act
    await sut.execute(documentId, userId);

    // assert
    expect(spy).toHaveBeenCalledWith(documentId);
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
});
