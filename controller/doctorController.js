
import Doctor from "../models/Doctor.js";
import fs from 'fs';
import path from 'path';

export const addDoctor = async (req, res) => {
  const { name, age, department, qualification, availability } = req.body ?? {};
  try {
    await Doctor.create({ name, age, department, qualification, availability, image: req.imagePath })
    return res.status(201).json({ message: "Doctor details added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export const getDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.find();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.status(200).json(doctor);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

export const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.status(200).json(doctor);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { name, age, department, qualification, availability } = req.body || {};
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.name = name || doctor.name;
    doctor.age = age || doctor.age;
    doctor.department = department || doctor.department;
    doctor.qualification = qualification || doctor.qualification;
    doctor.availability = availability || doctor.availability;

    if (req.imagePath) {
      try {
        await fs.promises.unlink(`./uploads/${doctor.image}`);
      } catch (_) { }
      doctor.image = req.imagePath;
    }
    await doctor.save();
    return res.status(200).json({ message: "Doctor details updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (doctor.image) {
      const imagePath = path.join("./uploads", doctor.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.log("File delete failed:", err.message);
        }
      }
    }

    await Doctor.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};