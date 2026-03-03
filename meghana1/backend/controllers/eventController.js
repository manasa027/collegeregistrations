// backend/controllers/eventController.js
// Handles event CRUD operations and publishing.

const { validationResult } = require("express-validator");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const ROLES = require("../utils/roles");

// POST /api/events (EventOwner only)
const createEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input", errors: errors.array() });
    }

    const { title, description, date, venue, totalSeats } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      totalSeats,
      availableSeats: totalSeats,
      owner: req.user._id,
      // Mark new events as published by default so students can see and register immediately
      published: true
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    next(error);
  }
};

// GET /api/events (list all published events)
const getPublishedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ published: true }).populate("owner", "name email");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("owner", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id (owner only)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your own events" });
    }

    const { title, description, date, venue, totalSeats } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (venue) event.venue = venue;

    if (typeof totalSeats === "number") {
      const seatsDiff = totalSeats - event.totalSeats;
      const registeredCount = event.totalSeats - event.availableSeats;
      if (totalSeats < registeredCount) {
        return res.status(400).json({
          message: `Cannot set total seats below already registered students (${registeredCount})`
        });
      }
      event.totalSeats = totalSeats;
      event.availableSeats += seatsDiff;
    }

    const updated = await event.save();
    res.json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id (owner or admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isOwner = event.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can delete only your own events" });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: "Event and its registrations deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/events/:id/publish (owner only)
const publishEvent = async (req, res, next) => {
  try {
    const { published = true } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can publish only your own events" });
    }

    event.published = Boolean(published);
    const updated = await event.save();

    res.json({
      message: `Event ${updated.published ? "published" : "unpublished"} successfully`,
      event: updated
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id/registrations (owner or admin)
const getRegistrationsForEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isOwner = event.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You can view registrations only for your own events" });
    }

    const registrations = await Registration.find({ event: eventId }).sort({ registeredAt: -1 });
    // Provide full registration data plus a convenience list of emails for the owner
    const emails = registrations.map((r) => r.email);
    res.json({ registrations, emails });
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/events/admin/all
const getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().populate("owner", "name email role");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/events/admin/users
const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await require("../models/User").find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getPublishedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  getRegistrationsForEvent,
  getAllEventsAdmin,
  getAllUsersAdmin
};

