import Reminder from "../models/Reminder.js";

export const createReminder = async (req, res) => {
  try {
    const { medicineName, dose, time, note } = req.body;

    if (!medicineName || !dose || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = await Reminder.create({
      user: req.user._id, // coming from authentication middleware
      medicineName,
      dose,
      time,
      note,
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await reminder.deleteOne();
    res.status(200).json({ message: "Reminder deleted" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};
