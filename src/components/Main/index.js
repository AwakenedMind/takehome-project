import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Cards from '../Cards';
import Chips from '../Chips';

const Main = ({ list, tweets, handleRemoveStock, isLoading, numTweets }) => {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container
				style={{
					backgroundColor: '#191B20',
					minHeight: 'calc(100vh - 64px)',
					height: '100%',
					paddingTop: '2rem',
				}}
			>
				<Typography component="div" />
				<Chips
					handleRemoveStock={handleRemoveStock}
					numTweets={numTweets}
					list={list}
				/>
				<Cards tweets={tweets} isLoading={isLoading} />
			</Container>
		</React.Fragment>
	);
};

export default Main;
