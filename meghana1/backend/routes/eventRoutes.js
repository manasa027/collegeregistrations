// backend/routes/eventRoutes.js
// Event-related routes.

const express = require("express");
const { body } = require("express-validator");
const {
  createEvent,
  getPublishedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  publishEvent,
  getRegistrationsForEvent,
  getAllEventsAdmin,
  getAllUsersAdmin
} = require("../controllers/eventController");
const { protect, authorizeRoles, ROLES } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPublishedEvents);
router.get("/:id", getEventById);

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.EVENT_OWNER),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("date").notEmpty().withMessage("Date is required"),
    body("venue").notEmpty().withMessage("Venue is required"),
    body("totalSeats").isInt({ min: 1 }).withMessage("Total seats must be a positive integer")
  ],
  createEvent
);

router.put("/:id", protect, authorizeRoles(ROLES.EVENT_OWNER), updateEvent);
router.delete("/:id", protect, deleteEvent);

router.post("/:id/publish", protect, authorizeRoles(ROLES.EVENT_OWNER), publishEvent);

router.get("/:id/registrations", protect, getRegistrationsForEvent);

router.get("/admin/all", protect, authorizeRoles(ROLES.ADMIN), getAllEventsAdmin);
router.get("/admin/users", protect, authorizeRoles(ROLES.ADMIN), getAllUsersAdmin);

module.exports = router;

