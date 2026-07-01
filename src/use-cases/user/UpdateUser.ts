import { UserUpdateInputDTO, UserOutputDTO } from '../../dtos/index.js';
import {
  UpdateUserRepository,
  GetUserByIdRepository,
  GetUserByEmailRepository,
  GetUserByCpfRepository,
} from '../../repositories/index.js';
import {
  CpfAlreadyExistError,
  EmailAlreadyExistsError,
  UserNotFoundError,
} from '../../errors/index.js';

export class UpdateUserUseCase {
  private updateUserRepository: UpdateUserRepository;
  private getUserByIdRepository: GetUserByIdRepository;
  private getUserByEmailRepository: GetUserByEmailRepository;
  private getUserByCpfRepository: GetUserByCpfRepository;

  constructor(
    updateUserRepository: UpdateUserRepository,
    getUserByIdRepository: GetUserByIdRepository,
    getUserByEmailRepository: GetUserByEmailRepository,
    getUserByCpfRepository: GetUserByCpfRepository
  ) {
    this.updateUserRepository = updateUserRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.getUserByCpfRepository = getUserByCpfRepository;
  }

  private async validateEmail(email: string) {
    const getUserByEmail = await this.getUserByEmailRepository.execute(email);

    if (getUserByEmail?.email === email) {
      throw new EmailAlreadyExistsError(email);
    }
  }

  private async validateCpf(cpf: string) {
    const getUserByCpf = await this.getUserByCpfRepository.execute(cpf);

    if (getUserByCpf?.cpf === cpf) {
      throw new CpfAlreadyExistError(cpf);
    }
  }

  async execute(
    userId: string,
    userData: UserUpdateInputDTO
  ): Promise<UserOutputDTO> {
    const getUserById = await this.getUserByIdRepository.execute(userId);
    if (!getUserById) {
      throw new UserNotFoundError();
    }

    if (userData.email) {
      await this.validateEmail(userData.email);
    }

    if (userData.cpf) {
      await this.validateCpf(userData.cpf);
    }

    const updatedUser = await this.updateUserRepository.updateUser(
      userId,
      userData
    );
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      cpf: updatedUser.cpf,
      createdAt: updatedUser.createdAt,
    };
  }
}
