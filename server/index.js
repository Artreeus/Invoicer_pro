import 'dotenv/config';
import app from './app.js';
import { connect } from './db.js';

// Local development entry point: connect first, then start a long-lived server.
// On Vercel the app is imported by api/index.js and run as a serverless function
// instead (see api/index.js and vercel.json).
const PORT = process.env.PORT || 4000;

connect()
  .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
