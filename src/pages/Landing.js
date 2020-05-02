import React, { useEffect, useState } from 'react';
import './Landing.scss';
import Navbar from '../components/Navbar';
import axios from 'axios';
import useInterval from '../hooks/useInterval';
import Main from '../components/Main';

const Landing = () => {
	const [input, setInput] = useState('');
	const [tweets, setTweets] = useState([]);
	const [list, setList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [numTweets, setNumTweets] = useState([]);

	// alert if any characters are not letters or a comma
	const handleInputChange = (e) => {
		e.target.value.match(/^[a-zA-Z, \s \b]+$/) || e.target.value.length < 1
			? setInput(e.target.value.toUpperCase())
			: alert('Only letters and commas are allowed');
	};

	// a few regex tests and mutations for input
	const regexTests = (str) => {
		// Alert error if input is a single comma
		if (str === ',') {
			alert(`${str} is not a stock symbol`);
			setInput('');
			return;
		}

		// Alert error if input is empty
		if (str === '') {
			alert(`An empty string is not a stock symbol`);
			setInput('');
			return;
		}

		// Alert error if input is greater than 80 characters
		if (str.length > 80) {
			alert('Too many characters');
			setInput('');
			return;
		}

		// Replace trailing commas with one comma
		// Ex: "AMZN,,,,,"  -> "AMZN,"
		if (str.match(/([,\s]+$)/g)) {
			setInput(str.replace(/([,\s]+$)/g, ','));
		}

		// Will check for a comma followed by a space and replace with ", "
		// Ex: "AMZN,ROKU"  ->  "AMZN, ROKU"
		if (str.match(/,/g)) {
			setInput(str.replace(/,/g, ', '));
		}

		return true;
	};

	// handle symbol(s) input when user presses Enter
	const handlePressEnter = (e) => {
		e.preventDefault();

		// test input with regex
		if (regexTests(input) !== true) return;

		let splitSymbols = [];

		// Input possibly has multiple symbols
		if (input.includes(',')) {
			// create a new array after doing regex tests beforehand
			splitSymbols = Array.from(
				new Set(input.trim().split(',').join('').trim().split(' '))
			);

			// filter out empty strings
			splitSymbols = splitSymbols.filter((el) => el != null);
		}
		// Invoked if multiple symbols were found
		if (splitSymbols.length > 0) {
			// remove duplicates
			splitSymbols = Array.from(new Set(splitSymbols));

			// filter out empty strings
			splitSymbols = splitSymbols.filter((el) => el != null);

			handleFetchTweets(splitSymbols.join(), splitSymbols);
		} else {
			handleFetchTweets(input, input.split());
		}
	};

	// Filter the current tweets with the new tweets by id to remove duplicates
	const filterTweetsById = (prev, cur) => {
		const filtered = cur.filter((a) => {
			return prev.includes(a.id);
		});
		return filtered;
	};

	// Fetch new 30 tweets from StockTwits
	const handleFetchTweets = async (string = list.join(), sym) => {
		setIsLoading(true);
		try {
			const res = await axios.get(
				`/.netlify/functions/server/api/tweets${string}`
			);

			if (list.length > 0) {
				let newMessages = filterTweetsById(tweets, res.data.messages);

				// If no new messages then just return
				if (newMessages.length > 0)
					setTweets((prevTweets) => [newMessages, ...prevTweets]);
			} else {
				// Ran during first fetch
				setTweets((prevTweets) => [...res.data.messages, ...prevTweets]);
			}

			setInput('');
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
			if (sym)
				setList((prevList) => Array.from(new Set([...prevList, ...sym])));

			// run during useInterval hook
			if (!!sym) setList((prevList) => Array.from(new Set([...prevList])));
		}
	};

	// Filter tweets by symbol.id to update tweet count
	const handleCleanTweets = (currentTicker) => {
		setTweets((prevTweets) =>
			prevTweets.filter((t) =>
				t.symbols.every((x) => x.symbol !== currentTicker)
			)
		);
	};

	// Remove the selected stock symbol the user clicked
	const handleRemoveStock = (currentTicker) => {
		if (tweets.length < 1) return;

		handleCleanTweets(currentTicker);

		// Update the list in state
		setList((prevList) =>
			prevList.filter((ticker) => ticker !== currentTicker)
		);
	};

	// Update the number of tweets per symbol
	const getNumTweets = () => {
		if (tweets.length < 1) return;

		let numTweets = tweets
			.map((a) => a.symbols)
			.flat()
			.map((b) => b.symbol);

		setNumTweets(numTweets);
	};

	// Update number of tweets per symbol every time tweets arr is updated
	useEffect(() => {
		tweets.length > 0 && getNumTweets();
	}, [tweets]);

	// Fetch new tweets every 30s using the symbols in list
	useInterval(() => {
		tweets.length > 0 && list.length > 0 && handleFetchTweets();
	}, 30000);

	return (
		<div className="landing">
			<Navbar
				handleInputChange={handleInputChange}
				handlePressEnter={handlePressEnter}
				input={input}
			/>
			<Main
				tweets={tweets}
				handleRemoveStock={handleRemoveStock}
				isLoading={isLoading}
				numTweets={numTweets}
				list={list}
			/>
		</div>
	);
};

export default Landing;
