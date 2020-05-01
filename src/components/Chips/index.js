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

const Chips = ({ list, handleRemoveStock, numTweets }) => {
	const classes = useStyles();
	const isList = list && list.length > 0;

	const getTweetCount = (chip) => {
		let numFound = 0;
		for (let i = 0; i < numTweets.length; i++) {
			if (numTweets[i].toUpperCase() === chip.toUpperCase()) {
				numFound = numFound + 1;
			}
		}

		return numFound;
	};

	return (
		<React.Fragment>
			{isList && (
				<div className={classes.root}>
					{list.map((chip) => (
						<Chip
							key={chip}
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
			)}
		</React.Fragment>
	);
};

export default Chips;
