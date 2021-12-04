interface CustomError {
  message: string;
}

interface CustomResponse {
  success: boolean;
  data: object;
  error: CustomError | {};
}

// type ResponseArguments = { error: string } | { data: unknown };
type ResponseArguments = {
  error?: string;
  data?: object;
};

/** Helper function to unify the responses made, so it's easy to parse responses on front end. */
export function createResponse({
  data,
  error,
}: ResponseArguments): CustomResponse {
  if (error !== undefined) {
    return { success: false, data: {}, error: { message: error } };
  }
  if (data !== undefined) {
    return { success: true, data: data, error: {} };
  }
  throw new Error(
    'You did not supply a data either data or error to createResponse()'
  );
}
