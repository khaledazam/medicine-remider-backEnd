import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
    },
    dosage: {
      type: String,
      required: [true, "Dosage information is required"],
    },
    time: {
      type: Date,
      required: [true, "Reminder time is required"],
    },
    note: {
      type: String,
    },
    isTaken: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reminder", reminderSchema);
