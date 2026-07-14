export interface UserInputDTO {
    name: string;
    cpf: string;
    email: string;
    password: string;
}

export type UserUpdateInputDTO = Partial<UserInputDTO>;

export interface UserOutputDTO {
    id: string;
    name: string;
    email: string;
    cpf: string;
    createdAt: Date;
    deletedAt?: Date | null;
}