const admin = require('../config/firebase');
const db = admin.firestore();

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.get();
        const events = [];
        
        snapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });
        
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get a single event by ID
const getEventById = async (req, res) => {
    try {
        const eventRef = db.collection('events').doc(req.params.id);
        const doc = await eventRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Create a new event
const createEvent = async (req, res) => {
  // Debug logging
  // console.log("Event received from frontend:", req.body);

  try {
    const { title, description, date, location, organizer, type, doneBy } = req.body;

    // Extract ID token from Authorization header
    const authHeader = req.headers.authorization;
    // Debug logging
    // console.log("Authorization header:", req.headers.authorization);

    const idToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : null;

    let uid = "anonymous";
    let email = "anonymous";

    if (idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        email = decodedToken.email || "no-email";
        // Debug logging
        // console.log("Decoded UID:", uid, "Email:", email);
      } catch (err) {
        console.warn("Invalid or expired token:", err.message);
      }
    }

    if (!title || !date || !doneBy) {
      return res.status(400).json({ message: "Title, date, and doneBy are required" });
    }

    const eventData = {
      title,
      description: description || "",
      date,
      location: location || "",
      organizer: organizer || email,
      type: type || "general",
      doneBy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("events").add(eventData);
    res.status(201).json({ id: docRef.id, ...eventData });

    await db.collection('meta').doc('refreshTrigger').set({
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Debug logging
    // console.log("Successfully wrote event to Firestore: ID =", docRef.id);

  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
    try {
        const { title, description, date, location, organizer, type, doneBy } = req.body;
        const eventRef = db.collection('events').doc(req.params.id);
        
        // Check if event exists
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        // Update only provided fields
        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (date) updateData.date = date;
        if (location !== undefined) updateData.location = location;
        if (organizer !== undefined) updateData.organizer = organizer;
        if (type) updateData.type = type;
        if (doneBy !== undefined) updateData.doneBy = doneBy;
        updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        
        await eventRef.update(updateData);
        const updatedDoc = await eventRef.get();
        res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const eventRef = db.collection('events').doc(req.params.id);
        
        // Check if event exists
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        await eventRef.delete();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
