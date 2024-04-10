import './Dashboard.css'
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import Button from '../../../components/Button/Button';
import { Link } from 'react-router-dom';
import convertSecondsToFormattedTime from '../../../utils/formattedTime';
import { FaFire } from "react-icons/fa6";
import CircleDayCheck from '../../../components/CircleDayCheck/CircleDayCheck';

function Dashboard() {

  const timeCompleted = JSON.parse(localStorage.getItem('timeCompleted')) || 0
  const dailyTimeGoal = 5400
  console.log(timeCompleted)

  const date = new Date()
  const daysWeekNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const dayName = daysWeekNames[date.getDay()]
  const dayNumber = date.getDate()
  const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul',
    'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const month = monthsNames[date.getMonth()]
  const year = date.getFullYear()

  return (
    <div className="main-dashboard-conteiner">

      <div className='hero-header-conteiner'>
        <div className='column-call-to-action-conteiner'>
          <h2>Comece a sua sessão de concentração agora.</h2>
          <span className='text-time-goal'>
            {timeCompleted >= dailyTimeGoal ?
              "Parabéns, você bateu sua meta diária!. Continue assim!"
              :
              `Falta só ${convertSecondsToFormattedTime(dailyTimeGoal - timeCompleted).hourAndMinutes} para concluir sua meta diária, não desiste agora`}
          </span>
          <div className='progress-conteiner'>
            <ProgressBar isShowPorcentage={true} timeCompleted={timeCompleted} dailyTimeGoal={dailyTimeGoal} />
            <span className="text-call-to-action">
              Sua meta diária e de {convertSecondsToFormattedTime(dailyTimeGoal).hourAndMinutes}
            </span>
          </div>
          <Link to="/pomodoro" >
            <Button textColor={"#fff"} backgroundColor={'#F85A16'} >Começar concentração!</Button>
          </Link>
        </div>

        <div className='info-user-conteiner'>
          <h4>Sequência de dias em que você bateu sua meta diária:</h4>
          <div>
            <div className='icon-text-days-concluds'>
              <FaFire color='#F85A16' size={"1.6rem"} />
              <span className="days-concluds">2 dias consecutivos</span>
            </div>
            <div className='circles-days-checks'>
              <CircleDayCheck dayAbbreviation={"seg"} isDayGoalComplete={false} />
              <CircleDayCheck dayAbbreviation={"ter"} isDayGoalComplete={true} />
              <CircleDayCheck dayAbbreviation={"qua"} isDayGoalComplete={true} />
              <CircleDayCheck dayAbbreviation={"qui"} />
              <CircleDayCheck dayAbbreviation={"sex"} />
              <CircleDayCheck dayAbbreviation={"sab"} />
              <CircleDayCheck dayAbbreviation={"dom"} />
            </div>
          </div>
          <span className="text-user-motivation">Continue assim, aos poucos você está criando o hábito de estudar!!</span>
          <div className="line"></div>
          <div className="header-schedule">
            <h4>Agenda</h4>
            <div className="date-conteiner">
              <span className="day-number">{dayNumber}</span>
              <div className="conteiner-y-m-dtext">
                <span>{dayName}</span>
                <div className='mouth-year-conteiner'>
                  <span>{month}</span>
                  <span>{year}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="list-tasks-in-schedule">
            <span>Em construção...</span>
          </div>
        </div>
      </div>

      <div className='in-contruction'>
        <h3>Em construção...</h3>
      </div>

    </div>
  );
}

export default Dashboard;