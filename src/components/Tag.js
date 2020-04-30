import React from 'react';
import styled from 'styled-components';

const Tag = ({ ticker, handleClick }) => {
	return (
		<StyledTag key={ticker} onClick={handleClick}>
			{ticker}
			<i className="fas fa-times"></i>
		</StyledTag>
	);
};

const StyledTag = styled.li`
	background: black;
	color: white;
	maxwidth: 80px;
	width: 60px;
`;

export default Tag;
