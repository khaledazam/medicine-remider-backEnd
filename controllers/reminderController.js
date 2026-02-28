import Reminder from "../models/Reminder.js";

// =======================
// CREATE Reminder
// =======================
export const createReminder = async (req, res) => {
  try {
    const { medicineName, dose, time, note, repeat, isImportant } = req.body;

    if (!medicineName || !dose || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = await Reminder.create({
      user: req.user._id,
      medicineName,
      dose,
      time,
      note: note || "",
      repeat: repeat || "once",     // new
      isImportant: isImportant || false, // new
      isDone: false, // default
    });

    res.status(201).json({
      message: "Reminder created successfully",
      data: reminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET ALL Reminders
// =======================
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ time: 1 });

    res.status(200).json({
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET Single Reminder
// =======================
export const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error("Error fetching reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// UPDATE Reminder
// =======================
export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found or not authorized" });
    }

    res.status(200).json({
      message: "Reminder updated successfully",
      data: reminder,
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// DELETE Reminder
// =======================
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found or not authorized" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// Toggle Reminder Done
// =======================
export const toggleDone = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.isDone = !reminder.isDone;
    await reminder.save();

    res.status(200).json({
      message: "Reminder status updated",
      data: reminder,
    });
  } catch (error) {
    console.error("Error toggling reminder:", error);
    res.status(500).json({ message: "Server error" });
  }
};
