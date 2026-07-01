export class DocumentNotFoundError extends Error {
  constructor() {
    super('Document not found');
    this.name = 'DocumentNotFoundError';
  }
}

export class DocumentAlreadySignedError extends Error {
  constructor(title: string) {
    super(`Document ${title} already signed`);
    this.name = 'DocumentAlreadySignedError';
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`Email ${email} already exists`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class CpfAlreadyExistError extends Error {
  constructor(cpf: string) {
    super(`Cpf ${cpf} already exists`);
    this.name = 'CpfAlreadyExistError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}
