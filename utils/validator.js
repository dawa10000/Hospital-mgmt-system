
import validation from 'express-joi-validation';
import Joi from 'joi';


export const validators = validation.createValidator({});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

export const appointmentSchema = Joi.object({
  name: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  age: Joi.number().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  department: Joi.string().valid("General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Gynecology", "Urology").required(),
  doctor: Joi.string().valid("Dr. Aayush Aryal - Orthopedics", "Dr. Anupama Shrestha - Cardiology", "Dr. Binod Karki - Neurology", "Dr. Chandra Prasad Adhikari - Pediatrics", "Dr. Deepa Shrestha - Oncology", "Dr. Esha Shrestha - Dermatology", "Dr. Firoz Khan - Gynecology", "Dr. Gopal Sharma - Urology", "Dr. Hari Prasad Sharma - General").required(),
  message: Joi.string().max(500).allow('').optional()
})

export const doctorSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.string().required(),
  department: Joi.string().valid("General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "Dermatology", "Gynecology", "Urology").required(),
  qualification: Joi.string().required(),
  availability: Joi.string().valid("available", "not_available", "on_leave").required(),

})