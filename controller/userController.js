import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {

  const { email, password } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (!isExist) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compareSync(password, isExist.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign({
      id: isExist._id,
      role: isExist.role
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000
});

    return res.status(200).json({
      role: isExist.role,
      token
    });



  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      try {
        await fs.promises.unlink(`./uploads/${req.imagePath}`);
      } catch (_) {
      }
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPass = bcrypt.hashSync(password, 10);
    await User.create({
      username,
      email,
      password: hashPass,
      image: req.imagePath
    });

    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    })
  }
}

export const updateUserProfile = async (req, res) => {
  const { email, username } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;

    if (req.imagePath) {
      try {
        await fs.promises.unlink(`./uploads/${user.image}`);
      } catch (_) {
      }
      user.image = req.imagePath;
    }
    await user.save();
    return res.status(200).json({ message: "Profile updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

