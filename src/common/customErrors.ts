/** Base class  which all errors inherit */
export class ServerError extends ReferenceError {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export class RentalError extends ServerError {}
export class InvalidIDError extends ServerError {}
export class BadRequestError extends ServerError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class AuthenticationError extends ServerError {
  constructor(message: string) {
    super(message, 401);
  }
}

/** When user identity is known but they don't have the permission */
export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class DoesNotExistError extends ServerError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class InternalError extends ServerError {
  constructor(message: string) {
    super(message, 500);
  }
}
