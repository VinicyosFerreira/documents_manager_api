import argon2 from 'argon2';
import { GetUserByEmailRepository } from '../../repositories/index.js';
import { UserNotFoundError } from '../../errors/index.js';

export class LoginUserUseCase {
  constructor(private getUserByEmailRepository: GetUserByEmailRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository;
  }

  async execute(email: string, password: string) {
    const user = await this.getUserByEmailRepository.execute(email);

    if (!user || user.deletedAt) {
      throw new UserNotFoundError();
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
      createdAt: user.createdAt,
    };
  }
}
