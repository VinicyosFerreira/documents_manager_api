import argon2 from 'argon2';
import { vi } from 'vitest';
import { UserModel } from '../../../generated/prisma/models/User.js';
import { UserNotFoundError } from '../../errors/index.js';
import { LoginUserUseCase } from './LoginUser.js';

describe('LoginUserUseCase', async () => {
  const email = 'any_email';
  const password = 'any_password';

  const userDataOutput: UserModel = {
    id: 'any_id',
    name: 'any_name',
    email,
    cpf: 'any_cpf',
    password: 'any_hashed_password',
    createdAt: new Date(),
    deletedAt: null,
  };

  class GetUserByEmailRepositoryStub {
    async execute(): Promise<null | UserModel> {
      return userDataOutput;
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const sut = new LoginUserUseCase(getUserByEmailRepositoryStub);

    return {
      sut,
      getUserByEmailRepositoryStub,
    };
  };

  it('Should login user successfully', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      password: await argon2.hash(password),
    });

    // act
    const result = await sut.execute(email, password);

    // assert
    expect(result).toMatchObject({
      id: 'any_id',
      name: 'any_name',
      email,
      cpf: 'any_cpf',
    });
  });

  it('Should call GetUserByEmailRepository with correct email', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      password: await argon2.hash(password),
    });

    // act
    await sut.execute(email, password);

    // assert
    expect(spy).toHaveBeenCalledWith(email);
  });

  it('Should verify password', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const hashedPassword = await argon2.hash(password);
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      password: hashedPassword,
    });

    // act
    await sut.execute(email, password);

    // assert
    expect(await argon2.verify(hashedPassword, password)).toBe(true);
  });

  it('Should throw UserNotFoundError when user does not exist', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue(null);

    // act
    const promise = sut.execute(email, password);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should throw UserNotFoundError when user is deleted', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      deletedAt: new Date(),
    });

    // act
    const promise = sut.execute(email, password);

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it('Should throw Error when password is invalid', async () => {
    // arrange
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    const spy = vi.spyOn(getUserByEmailRepositoryStub, 'execute');
    spy.mockResolvedValue({
      ...userDataOutput,
      password: await argon2.hash('other_password'),
    });

    // act
    const promise = sut.execute(email, password);

    // assert
    await expect(promise).rejects.toThrow(new Error('Invalid credentials'));
  });
});
