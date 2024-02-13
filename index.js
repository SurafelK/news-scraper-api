const express = require('express');
const dotenv = require('dotenv');
const NewsRouters = require('./Routers/NewsRouters');


dotenv.config(); // Load environment variables from a .env file if present

const app = express();
const PORT = process.env.PORT || 5000; // Default port is 5000 if not specified in environment variables

// Use the NewsRouters as middleware
app.use('/api', NewsRouters);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
