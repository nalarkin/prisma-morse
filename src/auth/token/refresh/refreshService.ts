import { validateJWT } from '@/auth/utils';
import { BadRequestError } from '@/common';
import { JWTPayloadRequest } from '@/loaders/passport';

export async function validateRefreshToken(token?: string) {
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (token === undefined) {
    return new BadRequestError('You do not have a refresh token.');
  }
  try {
    const validatedJWT = validateJWT(token);
    return validatedJWT as unknown as JWTPayloadRequest;
  } catch (e) {
    return new BadRequestError('Invalid JWT');
  }
}

// export async function createRefreshToken(token: string, userId: number) {
//   return await refreshDAL.createRefreshToken(token, userId);
// }
