const express = require('express');
const app = express();
const cors = require("cors");
const { connectToServer } = require('./utils/db');
app.use(cors());
app.use(express.json());

// Import the API routes
const apiRoutes = require('./routes/api');

// Use the API routes as middleware
app.use('/api', apiRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  await connectToServer(); // Connect to the database
  console.log(`Server is running on port ${port}`);
});
