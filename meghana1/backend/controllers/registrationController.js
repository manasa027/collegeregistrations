// backend/controllers/registrationController.js
// Handles student registration for events.

const { validationResult } = require("express-validator");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// POST /api/registrations (Student registers for event)
const createRegistration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }

    const { fullName, rollNumber, year, section, email, eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.published) {
      return res.status(400).json({ message: "Event is not published yet" });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available for this event" });
    }

    const existing = await Registration.findOne({
      event: eventId,
      $or: [{ email: email.toLowerCase() }, { rollNumber }]
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event (email or roll number)" });
    }

    const registration = await Registration.create({
      fullName,
      rollNumber,
      year,
      section,
      email: email.toLowerCase(),
      event: eventId
    });

    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({ message: "Registration successful", registration });
  } catch (error) {
    next(error);
  }
};

// GET /api/registrations/my (Student: view own registrations)
const getMyRegistrations = async (req, res, next) => {
  try {
    const email = req.user.email.toLowerCase();
    const registrations = await Registration.find({ email })
      .populate("event", "title date venue")
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

module.exports = { createRegistration, getMyRegistrations };

