// Vercel serverless entry point. Express apps are themselves (req, res) handlers,
// so exporting the app lets Vercel invoke it as a function. The shared app
// connects to MongoDB lazily on the first request (see server/db.js).
import app from '../server/app.js';

export default app;
