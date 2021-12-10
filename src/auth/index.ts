import refreshToken from './token/refresh';
import register from './register/index';
import login from './login/index';
import protectedRoute from './protected/index';

export { refreshToken as refreshTokenAPI, register as registerAPI, login as loginAPI, protectedRoute as protectedAPI };
