import { vi } from 'vitest';
import { UserModel } from '../../../generated/prisma/models/User.js';
import { UserNotFoundError } from '../../errors/index.js';
import { GetUserByIdUseCase } from './GetUserById.js';

describe('GetUserByIdUseCase', async () => {
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

  class GetUserByIdRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return userDataOutput;
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub);

    return {
      sut,
      getUserByIdRepositoryStub,
    };
  };

  it('Should get user by id successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(userId);

    // assert
    expect(result).toMatchObject({
      id: userId,
      name: 'any_name',
      email: 'any_email',
      cpf: 'any_cpf',
    });
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
