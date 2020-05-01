import React, { useEffect, useState } from 'react';
import './Landing.scss';
import Navbar from '../components/Navbar';
import axios from 'axios';
import useInterval from '../hooks/useInterval';
import Main from '../components/Main';

const Landing = () => {
	const [symbol, setSymbol] = useState(''); // @String to capture changes in input

	const [list, setList] = useState([]); // @Array to store stock tickers
	const [tweets, setTweets] = useState([]); // @Array to store tweets
	const [numTweets, setNumTweets] = useState([]); // @Array to store the num tweets for each symbol

	const [isLoading, setIsLoading] = useState(false); // @Boolean to show if tweets are loading
	const [hasFetched, setHasFetched] = useState(false); // @Boolean to capture if tweets have been fetched or not

	/*
		@desc			Sanitize the input with regex to simplify the fetching process
		@note			A stronger regex can be applied to increase UX such as the limiting of 4 											characters after a comma
		@params 		(e)
	*/
	const handleSymbolChange = (e) => {
		console.log(e.target);
		if (
			e.target.value.match(/^[a-zA-Z, \s \b]+$/) ||
			e.target.value.length < 1
		) {
			setSymbol(e.target.value.toUpperCase());
		} else {
			alert('Only letters and commas are allowed');
		}
	};

	/*
		@desc			Add the stock symbol(s) to the list 
	*/
	const addStock = (e) => {
		e.preventDefault();

		let hasMultipleSymbols = false;
		let splitSymbols = [];

		// Alert error of a single comma
		if (symbol === ',') {
			alert(`${symbol} is not a stock symbol`);
			setSymbol('');
			return;
		}
		// Alert error of an empty string
		if (symbol === '') {
			alert(`An empty string is not a stock symbol `);
			setSymbol('');
			return;
		}

		// Check if the string is longer than 100 characters
		// longest ticker are 5 letters with comma and space "BERKB, " so 7 char
		// 70 characters with 10 character leeway
		if (symbol.length > 80) {
			alert('Too many characters');
		}

		// replace trailing commas with one comma
		// Ex: "AMZN,,,,,"  -> "AMZN,"
		if (symbol.match(/([,\s]+$)/g)) {
			setSymbol(symbol.replace(/([,\s]+$)/g, ','));
		}

		// will check for a comma followed by a space and replace with ", "
		// Ex: "AMZN,ROKU"  ->  "AMZN, ROKU"
		if (symbol.match(/,/g)) {
			console.log(symbol.replace(/,/g, ', '));

			setSymbol(symbol.replace(/,/g, ', '));
		}

		// execute if the string possibly contains multiple symbols
		if (symbol.includes(',')) {
			// create a new array after doing regex tests beforehand
			splitSymbols = Array.from(
				new Set(symbol.trim().split(',').join('').trim().split(' '))
			);

			// hack to filter out empty strings
			splitSymbols = splitSymbols.filter((el) => el != null);

			// alert error if the splitSymbols contains more than 10 symbols
			if (splitSymbols.length > 10) {
				alert('Maximum symbols of 10 has been exceeded');
				setSymbol('');
				return;
			}
			hasMultipleSymbols = true;
		}

		if (hasMultipleSymbols) {
			splitSymbols.map((sym) => setList((prevList) => [...prevList, sym]));
			setSymbol('');
		} else {
			if (list.length < 1) {
				setList((prevList) => [...prevList, symbol]);
				setSymbol('');
			} else {
				list.includes(symbol.trim())
					? alert(`${symbol.trim()} is already in the list`)
					: setList((prevList) => [...prevList, symbol]);
				setSymbol('');
			}
		}
	};

	/*
		@desc		fetch tweets from the backend 
		@note		currently does not support pagination
	*/
	const fetchTweets = async () => {
		let tickers = list.join(',');
		if (!tickers.length > 0) return;
		setIsLoading(true);
		try {
			const res = await axios.get(
				`/.netlify/functions/server/api/tweets${tickers}`
			);
			// setTweets((prevTweets) => [...prevTweets, ...res.data.messages]);

			if (hasFetched && list.length > 0) {
				let newMessages = filterTweetsById(tweets, res.data.messages);

				// if no new messages then just return
				if (newMessages.length > 0)
					setTweets((prevTweets) => [...prevTweets, newMessages]);
			} else {
				// first fetch
				setTweets((prevTweets) => [...prevTweets, ...res.data.messages]);
			}

			setHasFetched(true);
		} catch (err) {
			console.error(err);
		}
		setIsLoading(false);
	};
	/*
		@desc		filter the current tweets with the new tweets by id
		@note		perhaps a better alternative would be to compare highest id / dates
	*/
	const filterTweetsById = (prev, cur) => {
		const filtered = cur.filter((a) => {
			return prev.includes(a.id);
		});

		return filtered;
	};

	/*
		@desc		remove the specified stock from the list in state and filter the tweets 
					with specified stock
		@params 	(currentTicker) @string
	*/
	const handleRemoveStock = (currentTicker) => {
		// remove tweets with the selected currentTicker
		setTweets((prevTweets) =>
			prevTweets.filter((t) => t.symbols[0].symbol !== currentTicker)
		);

		// remove the selected ticker from list
		setList((prevList) =>
			prevList.filter((ticker) => ticker !== currentTicker)
		);

		// // update the num of tweets displayed
		// numTweets(tweets);

		// if the user has removed the only ticker in list update hasFetched to false so our interval hook does not get invoked
		if (list.length < 1) setHasFetched(false);
	};

	const getNumTweets = () => {
		// if tweets dont exist then reset state
		if (!tweets) setNumTweets([]);

		let numTweets = tweets
			.map((a) => a.symbols)
			.flat()
			.map((b) => b.symbol);

		console.log(numTweets);
		setNumTweets((prevNum) => [...prevNum, ...numTweets]);
	};

	/* @desc		Fetch number of tweets every time tweets or list gets updated */
	useEffect(() => {
		getNumTweets();
	}, [tweets]);

	/* @desc		Fetch tweets every time the user adds a symbol to the list */
	useEffect(() => {
		tweets && fetchTweets();
	}, [list]);

	/*
		@desc		Fetch new tweets every 30s 
		@note		A better approach would be to grab the most recent tweet id and search for 
					newer tweets instead of refetching & rerendering existing tweets
	*/
	useInterval(() => {
		hasFetched && list && fetchTweets();
	}, 30000);

	return (
		<div className="landing">
			<Navbar
				handleSymbolChange={handleSymbolChange}
				handleEnter={addStock}
				symbol={symbol}
			/>
			<Main
				list={list}
				tweets={tweets}
				handleRemoveStock={handleRemoveStock}
				isLoading={isLoading}
				numTweets={numTweets}
			/>
		</div>
	);
};

export default Landing;
