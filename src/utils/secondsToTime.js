const secondsToTime = (timeInSeconds) => {
	const timeFormated = new Date(timeInSeconds * 1000);
	const minutes = timeFormated.getUTCMinutes().toString().padStart(2, '0');
	const seconds = timeFormated.getUTCSeconds().toString().padStart(2, '0');

	return { minutes, seconds };
}

export default secondsToTime;