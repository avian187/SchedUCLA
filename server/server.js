const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const express = require('express');
const admin = require('./config/firebase');
const cors = require('cors');
const eventsRouter = require('./routes/events');

const app = express();
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/events', eventsRouter);

// Start Express Server
app.listen(3001, () => {
  console.log('-- Listening on http://localhost:3001');
  console.log('-- Server CLI ready. Type a command (help for options)');
  rl.prompt();
});

// -------- CLI Section -------- //
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

rl.on('line', async (line) => {
  const cmd = line.trim();

  switch (cmd) {
    case 'clear-events':
      try {
        const snapshot = await db.collection('events').get();

        if (snapshot.empty) {
          console.log('-- No events found.');
          break;
        }

        const batch = db.batch();
        snapshot.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        await db.collection('meta').doc('refreshTrigger').set({
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`-- Cleared ${snapshot.size} events and triggered refresh.`);
      } catch (err) {
        console.error('-- Failed to clear events:', err.message);
      }
      break;

    case 'help':
      console.log('📘 Commands:\n - clear-events\n - help\n - exit');
      break;

    case 'exit':
      rl.close();
      break;

    default:
      console.log(`-- Unknown command: "${cmd}"`);
      break;
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('-- Exiting CLI.');
  process.exit(0);
});
