import express from 'express';
import { appointmentSchema, validators } from '../utils/validator.js';
import { cancelAppointment, createAppointment, getAllAppointments, getAppointmentStats, getMyAppointments, updateAppointmentStatus } from '../controller/appointmentController.js';
import { notAllowed } from '../utils/notAllowed.js';
import { checkUser } from '../middleware/checkUser.js';
import { fileCheck } from '../middleware/fileCheck.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const router = express.Router();


router.route('/').post(checkUser, fileCheck, validators.body(appointmentSchema), createAppointment).all(notAllowed);

router.route('/all-appointments').get(checkUser, checkAdmin, getAllAppointments).all(notAllowed);

router.route('/my-appointments').get(checkUser, getMyAppointments).all(notAllowed);

router.route('/stats').get(checkUser, checkAdmin, getAppointmentStats).all(notAllowed);

router.route('/stats').get(checkUser, checkAdmin, getAppointmentStats).all(notAllowed);

router.route('/:id/status').patch(checkUser, checkAdmin, updateAppointmentStatus).all(notAllowed)

router.route('/:id/cancel').patch(checkUser, cancelAppointment).all(notAllowed);

export default router;