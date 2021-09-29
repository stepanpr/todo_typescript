import React from "react";


interface HeaderProps {
	sumOfIncompleteds: number;
}

export const Header: React.FunctionComponent<HeaderProps> = (props) => {

	return (
		<div className="header">
			<div className="header_container">
				<span className="header-title">TaskList</span>
				<span className="header-counter">осталось задач: {props.sumOfIncompleteds}</span>
			</div>
		</div>
	) ;
}