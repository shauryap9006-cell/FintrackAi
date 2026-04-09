const app = require("../backend/app.js");
const connectDB = require("../backend/config/db");

// Database connection for serverless
connectDB().catch(err => console.error("Database connection error:", err));

module.exports = app;
