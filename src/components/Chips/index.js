import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		background: 'white',
		width: '100%',
		maxWidth: '108ch',
		margin: '0 auto',
		borderBottom: '1px solid rgba(0,0,0,.1)',
		height: '100%',
		'& > *': {
			margin: theme.spacing(0.5),
		},
	},
}));

const Chips = ({ handleRemoveStock, numTweets, list }) => {
	const classes = useStyles();

	const getTweetCount = (chip) => {
		let numFound = 0;
		for (let i = 0; i < numTweets.length; i++) {
			if (numTweets[i].toUpperCase() === chip.toUpperCase()) {
				numFound = numFound + 1;
			}
		}

		return numFound;
	};
	console.log('numTweets' + numTweets);

	return list.length > 0 && numTweets.length > 0 ? (
		<div className={classes.root}>
			{list.map((chip, idx) => (
				<Chip
					key={`${chip} ${idx}`}
					variant="outlined"
					size="small"
					label={`${chip} ${getTweetCount(chip)}`}
					clickable
					color="secondary"
					onClick={() => handleRemoveStock(chip)}
					icon={<CloseIcon />}
				/>
			))}
		</div>
	) : null;
};

export default Chips;
