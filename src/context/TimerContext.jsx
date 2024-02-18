import { createContext, useState } from "react";

export const TimerContext = createContext();

const TIME_IN_SECONDS_FOCUS = 1 * 60 * 25; // 25 minutes
const TIME_IN_SECONDS_SHORT_BREAK = 1 * 60 * 5; // 5 minutess

export const TimerContextProvider = ({ children }) => {

	const [contextTime, setContextTime] = useState('focus');
	const [timeInSeconds, setTimeInSeconds] = useState(TIME_IN_SECONDS_FOCUS);

	function togleContextTime() {
		if (contextTime === 'focus') {
			console.log('Togle contextTime: shortBreak');
			
			setContextTime('shortBreak');
			setTimeInSeconds(TIME_IN_SECONDS_SHORT_BREAK);
		} else {
			console.log('Togle contextTime: focus');
			
			setContextTime('focus');
			setTimeInSeconds(TIME_IN_SECONDS_FOCUS);
		}
		console.log('Time in seconds: ', timeInSeconds);
}

	return (
		<TimerContext.Provider value={{ contextTime, togleContextTime, timeInSeconds, setTimeInSeconds }}>
			{children}
		</TimerContext.Provider>
	)
}