import './Timer.css';

function Timer(props) {

  const times = props.timerFormated;

  return (
    <div className="timer">
      <span className="minute">{times.minutes}</span>
      <span className="second">{times.seconds}</span>
    </div>
  )
}

export default Timer;