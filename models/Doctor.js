import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ["available", "not_available", "on_leave"],
    default: "available",
  },
  image: {
    type: String,
    required: true
  }
})

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;