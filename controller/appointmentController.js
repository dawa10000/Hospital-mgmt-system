import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  const { name, gender, age, email, phone, date, time, department, doctor, message } = req.body ?? {};
  try {
    await Appointment.create({
      user: req.userId,
      name, gender, age, email, phone, date, time, department, doctor,
      image: req.imagePath,
      message
    });
    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 9);
    const skip = (page - 1) * limit;

    const { search, department } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { doctor: { $regex: search, $options: 'i' } },
      ];
    }

    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }


    const [appointments, total] = await Promise.all([
      Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Appointment.countDocuments(filter),
    ]);

    return res.status(200).json({
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const validStatus = ["pending", "confirmed", "cancelled"];

  if (!validStatus.includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    return res.status(200).json({ message: "Status updated successfully", appointment });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json(appointments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    appointment.status = "cancelled";
    await appointment.save();

    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const [byDepartment, byStatus, total, recent] = await Promise.all([


      Appointment.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Appointment.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),


      Appointment.countDocuments(),


      Appointment.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    return res.status(200).json({ byDepartment, byStatus, total, recent });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};