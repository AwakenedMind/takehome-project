import React from 'react';
import styled from 'styled-components';
import './Tweet.scss';

const Tweet = ({ username, avatar, body, key }) => {
	return (
		<li key={key} className="card">
			<div className="profile">
				<img src={avatar} className="pic" />
				<span className="username">{username}</span>
			</div>
			<p className="message">{body}</p>
		</li>
	);
};

export default Tweet;
