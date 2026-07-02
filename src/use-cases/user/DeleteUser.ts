import { DeleteUserRepository } from '../../repositories/index.js';
import { UserNotFoundError } from '../../errors/index.js';
import { GetUserByIdRepository } from '../../repositories/index.js';

export class DeleteUserUseCase {
  private getUserByIdRepository: GetUserByIdRepository;
  private deleteUserRepository: DeleteUserRepository;
  constructor(
    deleteUserRepository: DeleteUserRepository,
    getUserByIdRepository: GetUserByIdRepository,
  ) {
    this.deleteUserRepository = deleteUserRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(userId: string): Promise<void> {
    const getUserById = await this.getUserByIdRepository.execute(userId);

    if (!getUserById || getUserById.deletedAt) {
      throw new UserNotFoundError();
    }

    await this.deleteUserRepository.execute(userId);
  }
}
