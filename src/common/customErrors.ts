/**
 * This module provides custom error messages which can improve error
 * handling and passing throughout this express application.
 *
 * Use the relevant error message that describes the situation, and return that value,
 * so that the function caller must be forced to handle that error. This works very well
 * with TypeScripts return type inference. Functions that call a function with multiple
 * return multiple types must handle all return types.
 * 
 * Example: ```
      async function getUser(id: number) {
        try {
          const user = await usersDAL.prismaGetUser({ id });
          if (user === null) {
            return new DoesNotExistError('User does not exist');
          }
          return user;
        } catch (err) {
          logger.error('Error occurred when querying user info.');
          return new BadRequestError('Error occurred when querying user info.');
        }
      }
 * ```
 * Error messages are modeled after the HTTP error codes. Link to more info:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
// Base class  which all errors inherit
export class ServerError extends ReferenceError {
  statusCode: number; // error status code which is typically used to provide correct code to res.status()
  // inherits message property which stores the error message
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export class RentalError extends ServerError {}
export class InvalidIDError extends ServerError {}
/** The server could not understand the request due to invalid syntax. */
export class BadRequestError extends ServerError {
  constructor(message: string) {
    super(message, 400);
  }
}
/**
 * Although the HTTP standard specifies "unauthorized", semantically this
 * response means "unauthenticated". That is, the client must authenticate
 * itself to get the requested response.
 */
export class AuthenticationError extends ServerError {
  constructor(message: string) {
    super(message, 401);
  }
}

/**
 * The client does not have access rights to the content; that is, it is
 * unauthorized, so the server is refusing to give the requested resource.
 * Unlike 401 Unauthorized, the client's identity is known to the server.
 * */
export class ForbiddenError extends ServerError {
  constructor(message: string) {
    super(message, 403);
  }
}
/**
 * The server can not find the requested resource.
 *
 * In an API, this can also mean that the endpoint is valid but the resource
 * itself does not exist. Servers may also send this response instead of 403
 * Forbidden to hide the existence of a resource from an unauthorized client.
 */
export class DoesNotExistError extends ServerError {
  constructor(message: string) {
    super(message, 404);
  }
}

/**  The server has encountered a situation it does not know how to handle. */
export class InternalError extends ServerError {
  constructor(message: string) {
    super(message, 500);
  }
}

// /** Different way of handling errors that will probably not use. */
// type Error<E> = E;
// type Success<T> = T;

// type Result<T, E> = Success<T> | Error<E>;
