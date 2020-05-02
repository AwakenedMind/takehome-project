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

	// helpers
	let noTweetsExist = tweets.length < 1;
	let tweetsExist = tweets.length > 0;
	let listExists = list.length > 0;
	let removeEmptyStrings = (s) => s.filter((el) => el != null);

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
			// a strong regex could be applied would have to additional research/testing
			splitSymbols = Array.from(
				new Set(input.trim().split(',').join('').trim().split(' '))
			);
			splitSymbols = removeEmptyStrings(splitSymbols);
		}
		// Invoked if multiple symbols were found
		if (splitSymbols.length > 0) {
			// remove duplicates
			splitSymbols = Array.from(new Set(splitSymbols));

			// filter out empty strings
			splitSymbols = removeEmptyStrings(splitSymbols);
			// splitSymbols = splitSymbols.filter((el) => el != null);

			handleFetchTweets(splitSymbols.join(), splitSymbols);
		} else {
			handleFetchTweets(input, input.split());
		}
	};

	// Fetch tweets from StockTwits
	const handleFetchTweets = async (string = list.join(), sym) => {
		setIsLoading(true);
		try {
			const res = await axios.get(
				`/.netlify/functions/server/api/tweets${string}`
			);

			// If a previous list exist lets filter for duplicates and sort by date
			if (listExists) {
				setTweets((prevTweets) =>
					handleCleanTweets(prevTweets, res.data.messages)
				);
			} else {
				// Run during first fetch
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

	// 1. combine old tweets with new tweets
	// 2. remove duplicate tweets by comparing id's
	// 3. sort the array by Date
	const handleCleanTweets = (prevTweets, newTweets) => {
		return [...newTweets, ...prevTweets]
			.reduce((acc, cur) => {
				return !acc.find((x) => x.id === cur.id) ? [...acc, ...[cur]] : acc;
			}, [])
			.sort((a, b) => {
				return new Date(b.created_at) - new Date(a.created_at);
			});
	};

	// Filter tweets by symbol.id to update tweet count
	const handleCleanTweetsNum = (currentTicker) => {
		setTweets((prevTweets) =>
			prevTweets.filter((t) =>
				t.symbols.every((x) => x.symbol !== currentTicker)
			)
		);
	};

	// Remove the selected stock symbol the user clicked
	const handleRemoveStock = (currentTicker) => {
		if (noTweetsExist) return;

		handleCleanTweetsNum(currentTicker);

		// Update the list in state
		setList((prevList) =>
			prevList.filter((ticker) => ticker !== currentTicker)
		);
	};

	// Update the number of tweets per symbol
	const getNumTweets = () => {
		if (noTweetsExist) return;

		let numTweets = tweets
			.map((a) => a.symbols)
			.flat()
			.map((b) => b.symbol);

		setNumTweets(numTweets);
	};

	// Update number of tweets per symbol every time tweets are added/removed
	useEffect(() => {
		tweetsExist && getNumTweets();
	}, [tweets]);

	// Fetch new tweets every 30s using the symbols in list
	useInterval(() => {
		tweetsExist && listExists && handleFetchTweets();
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
