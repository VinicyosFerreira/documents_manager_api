export interface UserInputDTO {
    name: string;
    cpf: string;
    email: string;
    password: string;
}

export interface UserOutputDTO {
    id: string;
    name: string;
    email: string;
    cpf: string;
    createdAt: Date;
}