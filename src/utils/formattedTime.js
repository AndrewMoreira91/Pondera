const convertSecondsToFormattedTime = (timeInSeconds) => {
	const timeFormated = new Date(timeInSeconds * 1000);
	const hours = timeFormated.getUTCHours().toString().padStart(2, '0');
	const minutes = timeFormated.getUTCMinutes()
	const seconds = timeFormated.getUTCSeconds().toString().padStart(2, '0');

	const textHourFormated = () => {
		if (hours === '00') {
			return '';
		}
		return `${hours} ${hours == 1 ? 'hora' : 'horas'}` + ' e';
	}

	const textMinuteFormated = minutes === 1 ? 'minuto' : 'minutos';

	const hourAndMinutes = `${textHourFormated()} ${minutes} ${textMinuteFormated}`;
	const minuteAndSeconds = `${minutes } ${textHourFormated} e ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
	
	return { minuteAndSeconds, hourAndMinutes, minutes, seconds};
}

export default convertSecondsToFormattedTime;