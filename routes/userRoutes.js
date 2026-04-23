import express from 'express';
import { notAllowed } from '../utils/notAllowed.js';
import { userFileCheck, userFileUpdateCheck } from '../middleware/userFileCheck.js';
import { loginSchema, registerSchema, validators } from '../utils/validator.js';
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controller/userController.js';
import { checkUser } from '../middleware/checkUser.js';

const router = express.Router();

router.route('/login').post(validators.body(loginSchema), loginUser).all(notAllowed);

router.route('/register').post(validators.body(registerSchema), userFileCheck, registerUser).all(notAllowed);

router.route('/profile').get(checkUser, getUserProfile).patch(checkUser, userFileUpdateCheck, updateUserProfile).all(notAllowed);

export default router;