import createError from 'http-errors';
import { validateJWT } from '../../../auth/utils';

export function validateRefreshToken(token?: string) {
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (token === undefined) {
    throw createError(400, 'You do not have a refresh token.');
  }
  try {
    return validateJWT(token);
  } catch (e) {
    throw createError(400, 'Invalid JWT');
  }
}

// export async function createRefreshToken(token: string, userId: number) {
//   return await refreshDAL.createRefreshToken(token, userId);
// }
