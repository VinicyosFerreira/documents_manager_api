import { CreateUserUseCase } from './CreateUser.js';
import argon2 from 'argon2';
import { vi } from 'vitest';
import { UserInputDTO } from '../../dtos/index.js';
import { UserModel } from '../../../generated/prisma/models/User.js';
import {
  EmailAlreadyExistsError,
  CpfAlreadyExistError,
} from '../../errors/index.js';

describe('CreateUserUseCase', async () => {
  const userDataInput: UserInputDTO = {
    name: 'any_name',
    email: 'any_email',
    cpf: 'any_cpf',
    password: 'any_password',
  };

  const userDataOutput = {
    ...userDataInput,
    id: 'any_id',
    createdAt: new Date(),
    deletedAt: null,
  };

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

  class CreateUserRepositoryStub {
    async execute() {
      return userDataOutput;
    }
  }

  const makeSut = () => {
    const createUserRepositoryStub = new CreateUserRepositoryStub();
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const getUserByCpfRepositoryStub = new GetUserByCpfRepositoryStub();

    const sut = new CreateUserUseCase(
      createUserRepositoryStub,
      getUserByEmailRepositoryStub,
      getUserByCpfRepositoryStub
    );

    return {
      sut,
      createUserRepositoryStub,
      getUserByEmailRepositoryStub,
      getUserByCpfRepositoryStub,
    };
  };

  it('Should create a new user successfully', async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const result = await sut.execute(userDataInput);

    // assert
    expect(result).toMatchObject({
      name: 'any_name',
      email: 'any_email',
      cpf: 'any_cpf',
      id: 'any_id',
    });
  });

  it('Should verify password', async () => {
    // arrange
    const { sut } = makeSut();
    const plainPassword = 'any_password';

    // act
    await sut.execute({
      ...userDataInput,
      password: plainPassword,
    });

    // argon2
    expect(await argon2.verify(userDataInput.password, plainPassword)).toBe(
      true
    );
  });

  it('Should call CreateUserRepository with correct data', async () => {
    // arrange
    const { sut, createUserRepositoryStub } = makeSut();
    const spy = vi.spyOn(createUserRepositoryStub, 'execute');

    // act
    await sut.execute(userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userDataInput);
  });

  it('Should call GetUserByEmailRepository with correct email', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');

    // act
    await sut.execute(userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userDataInput.email);
  });

  it('Should call GetUserByCpfRepository with correct cpf', async () => {
    // arrange
    const { sut, getUserByCpfRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByCpfRepositoryStub, 'execute');

    // act
    await sut.execute(userDataInput);

    // assert
    expect(spy).toHaveBeenCalledWith(userDataInput.cpf);
  });

  it('Should throw CpfAlreadyExistError in case of conflict', async () => {
    const { sut, getUserByCpfRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByCpfRepositoryStub, 'execute');
    spy.mockResolvedValue(userDataOutput);

    const promise = sut.execute(userDataInput);

    await expect(promise).rejects.toThrow(
      new CpfAlreadyExistError(userDataInput.cpf)
    );
  });

  it('Should throw EmailAlreadyExistsError in case of conflict', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue(userDataOutput);

    const promise = sut.execute(userDataInput);

    await expect(promise).rejects.toThrow(
      new EmailAlreadyExistsError(userDataInput.email)
    );
  });
});
