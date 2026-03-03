// backend/models/Event.js
// Event model: created by EventOwner, can be published/unpublished.

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    date: {
      type: Date,
      required: [true, "Date is required"]
    },
    venue: {
      type: String,
      required: [true, "Venue is required"]
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats are required"],
      min: [1, "At least 1 seat is required"]
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, "Available seats cannot be negative"]
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event owner is required"]
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;

