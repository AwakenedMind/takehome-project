require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use('/api', require('./routes/api/tweets'));

// Listen for server startup
app.listen(port, () => {
	console.log(`Server running at port ` + port);
});
