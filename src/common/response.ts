export type CustomError = {
  message: string;
};

export type CustomResponse = {
  success: boolean;
  data: object | null;
  error: CustomError | null;
};

// type ResponseArguments = { error: string } | { data: unknown };
export type ResponseArguments = {
  error?: string;
  data?: object;
};

/** Helper function to unify the responses made, so it's easy to parse responses on front end. */
export function createResponse({ data, error }: ResponseArguments): CustomResponse {
  if (error !== undefined) {
    return { success: false, data: null, error: { message: error } };
  }
  if (data !== undefined) {
    return { success: true, data: data, error: null };
  }
  throw new Error('You did not supply a data either data or error to createResponse()');
}
