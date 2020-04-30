import React from 'react';
import './Sidebar.scss';

const Sidebar = () => {
	return (
		<div className="sidebar">
			<img className="circle" src="https://picsum.photos/36/36" />
			<div className="title">Fintech</div>
			<div className="profile">
				<div className="link">Overview</div>
				<div className="bar"></div>
				<div className="bar"></div>
			</div>
			<div className="footer">
				<div className="footer-bar"></div>
			</div>
		</div>
	);
};

export default Sidebar;
