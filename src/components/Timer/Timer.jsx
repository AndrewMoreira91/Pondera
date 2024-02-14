import './Timer.css';

function Timer({ minutesAndSecondsFormated }) {

  return (
    <div className="timer">
      <span className="minute">{minutesAndSecondsFormated.minutes}</span>
      <span className="second">{minutesAndSecondsFormated.seconds}</span>
    </div>
  )
}

export default Timer;