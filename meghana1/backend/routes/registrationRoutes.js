// backend/routes/registrationRoutes.js
// Routes related to event registrations.

const express = require("express");
const { body } = require("express-validator");
const { createRegistration, getMyRegistrations } = require("../controllers/registrationController");
const { protect, authorizeRoles, ROLES } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles(ROLES.STUDENT),
  [
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("rollNumber").notEmpty().withMessage("Roll Number is required"),
    body("year").isIn(["1st", "2nd", "3rd", "4th"]).withMessage("Year must be 1st-4th"),
    body("section").notEmpty().withMessage("Section is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("eventId").notEmpty().withMessage("Event ID is required")
  ],
  createRegistration
);

router.get("/my", protect, authorizeRoles(ROLES.STUDENT), getMyRegistrations);

module.exports = router;

