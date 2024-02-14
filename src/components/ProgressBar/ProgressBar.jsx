import './ProgressBar.css'

const ProgressBar = ({ timeCompleted, dailyTimeGoal }) => {

	const increment = 1 / (dailyTimeGoal / 100)
	const progress = increment * timeCompleted

	return (
		<div className="progress-bar">
			<div className="progress-bar__progress" style={{ width: `${progress}%` }} />
		</div>
	)
}

export default ProgressBar