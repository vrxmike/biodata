/**
 * Connects to the MongoDB database using the provided ATLAS_URI.
 * @async
 * @function connectToServer
 * @throws {Error} If there is an error connecting to the database.
 */
require('dotenv').config({ path: './config.env' });
const mongoose = require("mongoose");
const { ATLAS_URI } = process.env;

/**
 * Connects to the MongoDB server using the provided URI.
 * @async
 * @function connectToServer
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectToServer = async function () {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process with a failure code
  }
};

module.exports = { connectToServer };
