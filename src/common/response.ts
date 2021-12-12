export type CustomError = {
  message: string;
};

export type CustomResponse = {
  success: boolean;
  data: object | null;
  error: CustomError | null;
  status?: number;
};

type SuccessResponse = { data: object };
// type ErrorResponse = { error: string; status?: number };
type ErrorResponse = { error: ServerError };
export type ResponseArguments = SuccessResponse | ErrorResponse;

/** Helper function to unify the responses made, so it's easy to parse responses on front end. */
export function createResponse(response: ResponseArguments): CustomResponse {
  if ('error' in response) {
    return { success: false, data: null, error: { message: response.error.message } };
  }
  return { success: true, data: response.data, error: null };
}

// export const wrap =
//   // @ts-expect-error recommended way to handle errors https://expressjs.com/en/advanced/best-practice-performance.html#use-try-catch

//     (fn) =>
//     // @ts-expect-error recommended way to handle errors https://expressjs.com/en/advanced/best-practice-performance.html#use-try-catch
//     (...args) =>
//       fn(...args).catch(args[2]);

/** Base class  which all errors inherit */
class ServerError extends ReferenceError {
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
