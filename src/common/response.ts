/**
 * Helper function Used to create unified responses throughout the express application.
 *
 * @example
 * // return successful response
 * return res.json(createResponse({ data: {name: 'John Doe', age: 25 }));
 * // return response with error
 * return res.status(400).json(createResponse({ error: new BadRequestError('You made a bad request') }));
 */
import { ServerError } from './customErrors';

// type for the response object
export type CustomResponse = {
  success: boolean;
  data: object | null;
  error: { message: string } | null;
};

type SuccessResponse = { data: object | unknown[] };
type ErrorResponse = { error: ServerError };
// Provided `response` paramter must be a success (has data property) or error (has error property)
export type ResponseArguments = SuccessResponse | ErrorResponse;

/**
 * Helper function to unify the responses made, so it's easy to parse responses on front end.
 */
export function createResponse(response: ResponseArguments): CustomResponse {
  if ('error' in response) {
    // then the error must be an instance of `@ServerError`
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
