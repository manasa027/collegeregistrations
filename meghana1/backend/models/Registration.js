// backend/models/Registration.js
// Registration for an event by a student.

const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"]
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"]
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st", "2nd", "3rd", "4th"]
    },
    section: {
      type: String,
      required: [true, "Section is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required"]
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate registration: same event & email OR same event & rollNumber
registrationSchema.index({ event: 1, email: 1 }, { unique: true });
registrationSchema.index({ event: 1, rollNumber: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;

