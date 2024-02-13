import './ProgressBar.css'

const ProgressBar = ({ progress }) => {

	return (
		<div className="progress-bar">
			<div className="progress-bar__progress" style={{ width: `${progress}%` }} />
		</div>
	)
}

export default ProgressBar