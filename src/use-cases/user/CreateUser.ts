import {
  CreateUserRepository,
  GetUserByEmailRepository,
  GetUserByCpfRepository,
} from '../../repositories/index.js';
import { UserInputDTO, UserOutputDTO } from '../../dtos/index.js';
import {
  EmailAlreadyExistsError,
  CpfAlreadyExistError,
} from '../../errors/index.js';
import argon2 from 'argon2';

export class CreateUserUseCase {
  private createUserRepository: CreateUserRepository;
  private getUserByEmailRepository: GetUserByEmailRepository;
  private getUserByCpfRepository: GetUserByCpfRepository;
  constructor(
    createUserRepository: CreateUserRepository,
    getUserByEmailRepository: GetUserByEmailRepository,
    getUserByCpfRepository: GetUserByCpfRepository
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.getUserByCpfRepository = getUserByCpfRepository;
  }

  async execute(data: UserInputDTO): Promise<UserOutputDTO> {
    const getUserByEmail = await this.getUserByEmailRepository.execute(
      data.email
    );
    const getUserByCpf = await this.getUserByCpfRepository.execute(data.cpf);

    if (getUserByCpf?.cpf === data.cpf) {
      throw new CpfAlreadyExistError(data.cpf);
    }

    if (getUserByEmail?.email === data.email) {
      throw new EmailAlreadyExistsError(data.email);
    }

    const hashPassword = await argon2.hash(data.password);
    data.password = hashPassword;
    const user = await this.createUserRepository.execute(data);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      createdAt: user.createdAt,
    };
  }
}
