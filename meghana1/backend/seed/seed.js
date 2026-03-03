// backend/seed/seed.js
// Inserts one admin, one event owner, one student, and a sample event.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Event = require("../models/Event");
const ROLES = require("../utils/roles");

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Event.deleteMany({});

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: ROLES.ADMIN
    });

    const owner = await User.create({
      name: "Event Owner",
      email: "owner@example.com",
      password: "password123",
      role: ROLES.EVENT_OWNER
    });

    const student = await User.create({
      name: "Student User",
      email: "student@example.com",
      password: "password123",
      role: ROLES.STUDENT
    });

    const event = await Event.create({
      title: "Sample Tech Talk",
      description: "An introductory tech talk for students.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: "Auditorium",
      totalSeats: 100,
      availableSeats: 100,
      owner: owner._id,
      published: true
    });

    console.log("Seed data created successfully:");
    console.log("Admin:", admin.email);
    console.log("Owner:", owner.email);
    console.log("Student:", student.email);
    console.log("Event:", event.title);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();

