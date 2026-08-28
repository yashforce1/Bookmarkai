import { Router } from 'express';
import { signup, signin } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { signinSchema, userSchema } from '../types/auth.types';

const router = Router();

// POST /api/v1/signup
router.post('/signup', validate(userSchema), signup);

// POST /api/v1/signin
router.post('/signin', validate(signinSchema), signin);

export default router;

