import React from 'react';
import Search from '../Search';
import styled from 'styled-components';
import Sidebar from '../Sidebar.js';

const Landing = () => {
	return (
		<LandingStyles>
			<Sidebar />
			<Search />
		</LandingStyles>
	);
};

const LandingStyles = styled.div`
	height: 100%;
	min-height: 100vh;
	background: #191b20;
	display: flex;
`;

export default Landing;
