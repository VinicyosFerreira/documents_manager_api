import { vi } from 'vitest';
import { UserModel } from '../../../generated/prisma/models/User.js';
import { UserUpdateInputDTO } from '../../dtos/index.js';
import {
  CpfAlreadyExistError,
  EmailAlreadyExistsError,
  UserNotFoundError,
} from '../../errors/index.js';
import { UpdateUserUseCase } from './UpdateUser.js';

describe('UpdateUserUseCase', async () => {
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

  const userDataInput: UserUpdateInputDTO = {
    name: 'updated_name',
    email: 'updated_email',
    cpf: 'updated_cpf',
  };

  class UpdateUserRepositoryStub {
    async updateUser(): Promise<UserModel> {
      return {
        ...userDataOutput,
        ...userDataInput,
      };
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return userDataOutput;
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return null;
    }
  }

  class GetUserByCpfRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return null;
    }
  }

  const makeSut = () => {
    const updateUserRepositoryStub = new UpdateUserRepositoryStub();
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const getUserByCpfRepositoryStub = new GetUserByCpfRepositoryStub();

    const sut = new UpdateUserUseCase(
      updateUserRepositoryStub,
      getUserByIdRepositoryStub,
      getUserByEmailRepositoryStub,
      getUserByCpfRepositoryStub
    );

    return {
      sut,
      updateUserRepositoryStub,
      getUserByIdRepositoryStub,
      getUserByEmailRepositoryStub,
      getUserByCpfRepositoryStub,
    };
  };

  it('Should update user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(userId, userDataInput);

    // assert
    expect(result).toMatchObject({
      id: userId,
      name: 'updated_name',
      email: 'updated_email',
      cpf: 'updated_cpf',
    });
  });

  it('Should call GetUserByIdRepository with correct id', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');

    // act
    await sut.execute(userId, userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userId);
  });

  it('Should call GetUserByEmailRepository with correct email', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');

    // act
    await sut.execute(userId, userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userDataInput.email);
  });

  it('Should call GetUserByCpfRepository with correct cpf', async () => {
    // arrange
    const { sut, getUserByCpfRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByCpfRepositoryStub, 'execute');

    // act
    await sut.execute(userId, userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userDataInput.cpf);
  });

  it('Should call UpdateUserRepository with correct data', async () => {
    // arrange
    const { sut, updateUserRepositoryStub } = makeSut();
    const spy = vi.spyOn(updateUserRepositoryStub, 'updateUser');

    // act
    await sut.execute(userId, userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userId, userDataInput);
  });

  it('Should not validate email when email is not provided', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');

    // act
    await sut.execute(userId, { name: 'updated_name' });

    // assert
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should not validate cpf when cpf is not provided', async () => {
    // arrange
    const { sut, getUserByCpfRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByCpfRepositoryStub, 'execute');

    // act
    await sut.execute(userId, { name: 'updated_name' });

    // assert
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should throw UserNotFoundError when user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByIdRepositoryStub, 'execute');
    spy.mockResolvedValue(null);

    // act
    const promise = sut.execute(userId, userDataInput);

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
    const promise = sut.execute(userId, userDataInput);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should throw EmailAlreadyExistsError in case of conflict', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      email: 'updated_email',
    });

    // act
    const promise = sut.execute(userId, userDataInput);

    // assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyExistsError('updated_email')
    );
  });

  it('Should throw CpfAlreadyExistError in case of conflict', async () => {
    // arrange
    const { sut, getUserByCpfRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByCpfRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      cpf: 'updated_cpf',
    });

    // act
    const promise = sut.execute(userId, {
      name: 'updated_name',
      cpf: 'updated_cpf',
    });

    // assert
    await expect(promise).rejects.toThrow(
      new CpfAlreadyExistError('updated_cpf')
    );
  });
});
