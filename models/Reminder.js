import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    dosage: {
      type: String,
      required: [true, "Dosage information is required"],
    },

    times: {
      type: [String], 
      required: true, 
    },

    repeatType: {
      type: String,
      enum: ["once", "daily", "weekly", "custom"],
      default: "daily",
    },

    daysOfWeek: {
      type: [Number], 
      default: [],
    },

    note: {
      type: String,
      default: "",
    },

    isTakenToday: {
      type: Boolean,
      default: false,
    },

    remindBeforeMinutes: {
      type: Number,
      default: 0, 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reminder", reminderSchema);
