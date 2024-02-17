import './CircleDayCheck.css';
import { useState } from 'react';
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const CircleDayCheck = ({ dayAbbreviation, isDayGoalComplete }) => {

	const [bgColor, setBgColor] = useState("#ffffff"); 
	const [icon, setIcon] = useState("")
	
	if (isDayGoalComplete && bgColor !== "#E88A1A") {
		setBgColor("#E88A1A");
		setIcon(<FaCheck color="#ffffff" size={"1.2rem"} />);
	} else if (isDayGoalComplete === false && bgColor !== "#ff0000") {
		setBgColor("#ff0000");
		setIcon(<IoMdClose color="#ffffff" size={"1.2rem"} />);
	}

	return (
		<div className="days-checks-item">
			<span>{dayAbbreviation}</span>
			<div className="circle-days-check" style={ {backgroundColor: bgColor} }>
				{icon}
			</div>
		</div>
	);
};

export default CircleDayCheck;