import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Spinner from '../Spinner';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: '108ch',
		backgroundColor: theme.palette.background.paper,
		margin: '0 auto',
		padding: '0',
	},
	inline: {
		display: 'inline',
	},
}));

const Cards = ({ tweets, isLoading }) => {
	const classes = useStyles();
	const tweetsExist = tweets && tweets.length > 0;

	return (
		<List className={classes.root}>
			{isLoading && <Spinner />}
			{tweetsExist &&
				tweets.map((tweet, idx) => (
					<ListItem alignItems="flex-start" key={`${tweet.id}-${idx}`}>
						<ListItemAvatar>
							<Avatar alt="Remy Sharp" src={tweet.user.avatar_url_ssl} />
						</ListItemAvatar>
						<ListItemText
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										className={classes.inline}
										color="textPrimary"
									>
										{tweet.user.username}
									</Typography>
									{tweet.body}
								</React.Fragment>
							}
						/>
					</ListItem>
				))}
		</List>
	);
};

export default Cards;
