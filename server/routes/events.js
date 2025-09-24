const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventHandler");

// Public: no auth needed
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Secure: auth required
router.post("/", verifyToken, createEvent);
router.put("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

module.exports = router;
