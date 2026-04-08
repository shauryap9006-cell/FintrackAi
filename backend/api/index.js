const app = require("../app.js");
const connectDB = require("../config/db");

// Database connection for serverless
connectDB().catch(err => console.error("Database connection error:", err));

module.exports = app;
