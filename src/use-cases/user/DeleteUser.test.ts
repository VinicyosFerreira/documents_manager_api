import { vi } from 'vitest';
import { UserModel } from '../../../generated/prisma/models/User.js';
import { UserOutputDTO } from '../../dtos/index.js';
import { UserNotFoundError } from '../../errors/index.js';
import { DeleteUserUseCase } from './DeleteUser.js';

describe('DeleteUserUseCase', async () => {
  const userId = 'any_id';

  const userDataOutput: UserModel = {
    id: userId,
    name: 'any_name',
    email: 'any_email',
    cpf: 'any_cpf',
    password: 'any_password',
    createdAt: new Date(),
    deletedAt: null,
  };

  class DeleteUserRepositoryStub {
    async execute(): Promise<UserOutputDTO> {
      return {
        ...userDataOutput,
        deletedAt: new Date(),
      };
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return userDataOutput;
    }
  }

  const makeSut = () => {
    const deleteUserRepositoryStub = new DeleteUserRepositoryStub();
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();

    const sut = new DeleteUserUseCase(
      deleteUserRepositoryStub,
      getUserByIdRepositoryStub
    );

    return {
      sut,
      deleteUserRepositoryStub,
      getUserByIdRepositoryStub,
    };
  };

  it('Should delete user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(userId);

    // assert
    expect(result).toBeUndefined();
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

  it('Should call DeleteUserRepository with correct id', async () => {
    // arrange
    const { sut, deleteUserRepositoryStub } = makeSut();
    const spy = vi.spyOn(deleteUserRepositoryStub, 'execute');

    // act
    await sut.execute(userId);

    // assert
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('Should throw UserNotFoundError when user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');
    spy.mockResolvedValue(null);

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should throw UserNotFoundError when user is deleted', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      deletedAt: new Date(),
    });

    // act
    const promise = sut.execute(userId);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });
});
