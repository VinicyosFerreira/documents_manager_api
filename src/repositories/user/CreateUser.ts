import {prisma} from '../../lib/prisma.js'
import {UserInputDTO} from '../../dtos/index.js'

export class CreateUserRepository {
    async execute(data: UserInputDTO) {
        return await prisma.user.create({
            data: {
              name: data.name,
              email: data.email,
              cpf: data.cpf,
              password: data.password
            },
        });
    }
}