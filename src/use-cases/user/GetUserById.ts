import { GetUserByIdRepository } from '../../repositories/index.js';
import { UserOutputDTO } from '../../dtos/index.js';
import { UserNotFoundError } from '../../errors/index.js';

export class GetUserByIdUseCase {
  private getUserByIdRepository;
  constructor(getUserByIdRepository: GetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(id: string): Promise<UserOutputDTO> {
    const result = await this.getUserByIdRepository.execute(id);

    if (!result) {
      throw new UserNotFoundError();
    }

    return result;
  }
}
