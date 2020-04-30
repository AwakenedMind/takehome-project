import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tag from './Tag';
import Tweet from './Tweet';
import useInterval from '../hooks/useInterval';
import './Search.scss';

const Search = () => {
	/*
		symbol			capture changes in input
		list			store stock tickers in an array
		tweets			store tweets in an array
		isLoading		boolean to show if tweets are loading
		hasFetched		boolean to capture if tweets have been fetched or not
	*/

	const [symbol, setSymbol] = useState('');
	const [list, setList] = useState([]);
	const [tweets, setTweets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const [error, setError] = useState('');
	const [activeTab, setActiveTab] = useState(list[0]);

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

	// Add the stock symbol(s) to the list if no duplicates are found
	/*
		@desc			Sanitize the input with regex to simplify the fetching process
		@note			A stronger regex can be applied to increase UX such as the limiting of 4 											characters after a comma
		@params 		(e)
	*/
	const addStock = () => {
		let isDuplicate = false;
		let duplicates = [];
		let hasMultipleSymbols = false;
		let splitSymbols = [];

		// check if symbol has a comma
		if (symbol.includes(',') || symbol.match(/^[a-zA-Z\s]+$/)) {
			// split by ", " and filter unique symbols
			// splitSymbols = Array.from(new Set(symbol.split(/[,][ ,]\s+/)));
			console.log(symbol);
			splitSymbols = Array.from(new Set(symbol.trim().split(',')));
			console.log(splitSymbols);
			hasMultipleSymbols = true;
		}

		// executed if the user is trying to add multiple
		if (hasMultipleSymbols) {
			// find duplicate, if found update isDuplicate to true
			// push the ticker symbol to the duplicates array
			list.map((ticker) =>
				splitSymbols.map((sym) => {
					if (sym.includes(ticker)) {
						isDuplicate = true;
						duplicates.push(ticker);
					}
				})
			);

			// filter the current list with the new duplicates array
			if (duplicates.length > 0) {
				// list.map((ticker) => duplicates.filter((dup) => ticker !== dup));

				let newSymbols = list.filter((item) => {
					return !duplicates.includes(item);
				});

				// update the list in state with only the new symbols in newList array
				setList((prevList) => [...prevList, newSymbols]);

				setSymbol('');
			} else {
				// If no duplicates, add multiple symbols to the list
				setList((prevList) => [...prevList, Array.from(new Set(splitSymbols))]);
				setSymbol('');
			}
			return;
		}
		// executed if the user is only trying to add one symbol
		if (!hasMultipleSymbols) {
			// add the symbol the list if the list was originally empty
			if (symbol === '' || symbol === ',') return;
			if (!list) {
				setList(symbol);
			} else {
				list.includes(symbol.trim()) && symbol === '' && symbol === ','
					? alert(`${symbol.trim()} is already in the list`)
					: setList((prevList) => [...prevList, ...symbol]);
				setSymbol('');
			}
		}
	};

	/*
		@desc		fetch tweets from the backend 
	*/
	const fetchTweets = async () => {
		let tickers = list.join(',');
		let isDevelopment = process.env.NODE_ENV === 'development' ? true : false;

		try {
			if (isDevelopment) {
				const res = await axios.get(`/api/tweets${tickers}`);
				console.log(res);
				setTweets((prevTweets) => [...prevTweets, ...res.data.messages]);
				setHasFetched(true);
			} else {
				const res = await axios.get(
					`https://frontend-engineer-challenge.netlify.app/api/tweets${tickers}`
				);
				console.log(res);
				setTweets((prevTweets) => [...prevTweets, ...res.data.messages]);
				setHasFetched(true);
			}
		} catch (err) {
			console.error(err);
		}
	};

	/*
		@desc		remove the specified stock from the list in state and filter the tweets 
					with specified stock
		@params 	(currentTicker) @string
	*/
	const removeStock = (currentTicker) => {
		// remove the selected ticker from list
		setList((prevList) =>
			prevList.filter((ticker) => ticker !== currentTicker)
		);

		// remove tweets with the selected currentTicker
		setTweets((prevTweets) =>
			prevTweets.filter((tweet) => tweet.symbols[0].symbol === currentTicker)
		);

		// if the user has removed the only ticker in list update hasFetched to false so our interval hook does not get invoked
		if (list.length < 1) setHasFetched(false);
	};

	/*
		@desc		Fetch tweets every time the user adds a symbol to the list
	*/
	useEffect(() => {
		fetchTweets();
	}, [list]);

	/*
		@desc		Fetch new tweets every 30s 
		@note		A better approach would be to grab the most recent tweet id and search for 
					newer tweets instead of refetching & rerendering existing tweets
	*/

	useInterval(() => {
		hasFetched && fetchTweets();
	}, 30000);

	return (
		<div className="search">
			<div className="input-container">
				<div className="input-wrapper">
					<input
						id="symbol"
						onChange={handleSymbolChange}
						placeholder="Add Ticker Symbol(s): APPL, BABA, AMZN"
						value={symbol}
					/>

					<button className="add" onClick={addStock}>
						Add
					</button>
				</div>
				<ul className="tags">
					{list.length > 0 &&
						list &&
						list.map((ticker, idx) => (
							<Tag
								key={idx}
								ticker={ticker}
								handleClick={() => removeStock(ticker)}
							></Tag>
						))}
				</ul>
			</div>
			<div className="container">
				<ul className="tabs">
					{list.length > 0 &&
						list &&
						list.map((ticker, idx) => (
							<li className={'tab'} key={idx}>
								{ticker}
							</li>
						))}
				</ul>

				<ul className="tweets">
					{tweets &&
						tweets.length > 0 &&
						tweets.map((tweet, idx) => (
							<Tweet
								key={idx}
								avatar={tweet.user.avatar_url}
								body={tweet.body}
								username={tweet.user.username}
							/>
						))}
				</ul>
			</div>
		</div>
	);
};

export default Search;
