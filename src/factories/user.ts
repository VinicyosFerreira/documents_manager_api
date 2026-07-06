import {
  CreateUserRepository,
  GetUserByCpfRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
  DeleteUserRepository,
} from '../repositories/index.js';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
} from '../use-cases/index.js';

export const makeCreateUser = () => {
  const createUserRepository = new CreateUserRepository();
  const getUserByCpfRepository = new GetUserByCpfRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    getUserByCpfRepository
  );
  return createUserUseCase;
};

export const makeGetUserById = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  return getUserByIdUseCase;
};

export const makeUpdateUser = () => {
  const updateUserRepository = new UpdateUserRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const getUserByCpfRepository = new GetUserByCpfRepository();
  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByIdRepository,
    getUserByEmailRepository,
    getUserByCpfRepository
  );
  return updateUserUseCase;
};

export const makeDeleteUser = () => {
  const deleteUserRepository = new DeleteUserRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const deleteUserUseCase = new DeleteUserUseCase(
    deleteUserRepository,
    getUserByIdRepository
  );
  return deleteUserUseCase;
};

export const makeLoginUser = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository();
  const loginUserUseCase = new LoginUserUseCase(getUserByEmailRepository);
  return loginUserUseCase;
};
