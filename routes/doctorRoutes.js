import express from 'express';
import { addDoctor, deleteDoctor, getDoctor, getDoctors, updateDoctor } from "../controller/doctorController.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { fileCheck, fileUpdateCheck } from "../middleware/fileCheck.js";
import { notAllowed } from "../utils/notAllowed.js";
import { doctorSchema, validators } from "../utils/validator.js";
import { checkUser } from '../middleware/checkUser.js';


const router = express.Router();

router.route('/add-doctor').post(checkUser, checkAdmin, fileCheck, validators.body(doctorSchema), addDoctor).all(notAllowed);

router.route('/').get(checkUser, getDoctors).all(notAllowed);

router.route('/:id').get(getDoctor).patch(checkUser, checkAdmin, fileUpdateCheck, updateDoctor).delete(checkUser, deleteDoctor).all(notAllowed);

export default router;