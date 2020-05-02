require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const router = express.Router();

const app = express();
const port = process.env.PORT || 5000;

const axios = require('axios');
const { SYMBOLS_STREAM_URL } = require('./utils/constants');

// Middleware
app.use(cors());

/*
    @route      GET /api/tweets:id
    @desc       Fetch Tweet Streams for multiple tickers from Stocktwits
    @access     Public
*/
router.get('/api/tweets:id', async (req, res) => {
	const params = { symbols: req.params.id, limit: 30 };
	const url = `${SYMBOLS_STREAM_URL}.json?access_token=${process.env.TOKEN}
`;
	try {
		const response = await axios.get(url, { data: params });
		return res.json(response.data);
	} catch (err) {
		console.error(err);
	}
});

// Listen for server startup
app.listen(port, () => {
	console.log(`Server running at port ` + port);
});

// Serverless middleware
app.use('/.netlify/functions/server', router);

module.exports = app;

// wrap express in the serverless package which functions as a decorator
module.exports.handler = serverless(app);
