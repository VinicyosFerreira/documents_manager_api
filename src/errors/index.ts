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
