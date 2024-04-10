import { createContext, useState } from "react";

export const TimerContext = createContext();


export const TimerContextProvider = ({ children }) => {
	const TIME_IN_SECONDS_FOCUS = 1 * 60 * 25; // 25 minutes
	const TIME_IN_SECONDS_SHORT_BREAK = 1 * 60 * 5; // 5 minutess

	const [contextTime, setContextTime] = useState('focus');
	const [timeInSeconds, setTimeInSeconds] = useState(TIME_IN_SECONDS_FOCUS);

	function togleContextTime() {
		if (contextTime === 'focus') {
			console.log('Togle contextTime: rest');

			setContextTime('rest');
			setTimeInSeconds(TIME_IN_SECONDS_SHORT_BREAK);
		} else {
			console.log('Togle contextTime: focus');
			
			setContextTime('focus');
			setTimeInSeconds(TIME_IN_SECONDS_FOCUS);
		}
	}

	function changeTime() {
		if (contextTime === 'focus') {
			setTimeInSeconds(TIME_IN_SECONDS_FOCUS);
		} else {
			setTimeInSeconds(TIME_IN_SECONDS_SHORT_BREAK);
		}
	}

	// console.log("Tempo restante: " + timeInSeconds)

	return (
		<TimerContext.Provider value={{
			contextTime,
			togleContextTime,
			timeInSeconds,
			setTimeInSeconds,
			changeTime,
		}}>
			{children}
		</TimerContext.Provider>
	)
}