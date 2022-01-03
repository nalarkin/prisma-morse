import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../loaders/swagger';

const router = Router();

router.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/** Get all users, currently doesn't require requester to be authenticated */

export default router;
