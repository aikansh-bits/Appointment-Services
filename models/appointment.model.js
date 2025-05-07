import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    appointmentID: { type: Number, unique: true, required: true },
    patientID: { type: String, required: true },
    doctorID: { type: String, required: true },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no_show", "rescheduled"],
      default: "scheduled",
    },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Appointment", appointmentSchema);
