import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import './App.css';

const App = () => {
	return (
		<Router>
			<Route path="/" exact component={Landing} />
		</Router>
	);
};

export default App;
