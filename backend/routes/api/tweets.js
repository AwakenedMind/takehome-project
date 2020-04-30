require('dotenv').config();

const express = require('express');
const router = express.Router();
const { SYMBOLS_STREAM_URL } = require('../../utils/constants');
const axios = require('axios');

/*
    @route      GET /api/tweets:id
    @desc       Fetch Tweet Streams for multiple tickers from Stocktwits
    @access     Public
*/
router.get('/tweets:id', async (req, res) => {
	const params = { symbols: req.params.id, limit: 5 };
	const url = `${SYMBOLS_STREAM_URL}.json?access_token=${process.env.TOKEN}
`;

	try {
		const response = await axios.get(url, { data: params });
		return res.json(response.data);
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
