import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
    },

    schedule: {
      type: [String],
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    reminderTime: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },

  refillAlertAt: {
    type: Number,
    default: 5,
  },
  prescriptionImage: {
    type: String,
    default: null,
  },
},
{ timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
