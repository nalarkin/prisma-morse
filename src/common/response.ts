import { ServerError } from './customErrors';

export type CustomError = {
  message: string;
};

export type CustomResponse = {
  success: boolean;
  data: object | null;
  error: CustomError | null;
  status?: number;
};

type SuccessResponse = { data: object | unknown[] };
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
