import './ProgressBar.css'

const ProgressBar = ({ timeCompleted, dailyTimeGoal, isShowPorcentage }) => {

	const increment = 1 / (dailyTimeGoal / 100)
	let progress = increment * timeCompleted
	progress = progress > 100 ? 100 : progress

	return (
		<div className="progress-bar">
			<div className="progress-bar__progress" style={{ width: `${progress}%` }}>
			</div>
			{isShowPorcentage && <span className="progress-bar__text" style={{ width: `${progress}%` }}>{Math.round(progress)}%</span>}
		</div>
	)
}

export default ProgressBar