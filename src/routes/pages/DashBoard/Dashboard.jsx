import './Dashboard.css'
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import Button from '../../../components/Button/Button';
import { Link } from 'react-router-dom';
import convertSecondsToFormattedTime from '../../../utils/formattedTime';
import Task from '../../../components/Task/Task';
import { FaFire } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../../services/axios';

function Dashboard() {

  const timeCompleted = JSON.parse(localStorage.getItem('timeCompleted')) || 0
  const dailyTimeGoal = 1500
  const queryClient = useQueryClient();

  useQuery('tasks', async () => {
    const res = await api.get('/tasks')
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute 
  })
  const previousTasksList = queryClient.getQueryData('tasks')

  const mutationDelete = useMutation(id => api.delete('/tasks/' + id))
  function deleteTask(taskId) {
    console.log('task deletada: ', taskId)
    mutationDelete.mutateAsync(taskId)
    if (mutationDelete.isError) {
      return console.log('erro ao deletar task\n ID da tasks à ser deletada:', taskId)
    }

    queryClient.setQueryData('tasks', () => {
      return previousTasksList.filter(task => task.id !== taskId)
    })
  }

  return (
    <div className="main-dashboard-conteiner">
      <div className='column-call-to-action-conteiner'>
        <h2>Comece a sua sessão de concentração agora.</h2>
        <span className='text-time-goal'>Sua meta diária e de {convertSecondsToFormattedTime(dailyTimeGoal).hourAndMinutes}</span>
        <div className='progress-conteiner'>
          <ProgressBar timeCompleted={timeCompleted} dailyTimeGoal={dailyTimeGoal} />
          <span className="text-call-to-action">
            Falta só {convertSecondsToFormattedTime(dailyTimeGoal - timeCompleted).hourAndMinutes} para concluir sua meta diária, não desiste agora
          </span>
        </div>
        <Link to="/pomodoro" >
          <Button textColor={"#fff"} backgroundColor={'#F85A16'} >Começar concentração!</Button>
        </Link>
      </div>

      <div className='info-user-conteiner'>
        <h4>Sequência de dias em que você bateu sua meta diária:</h4>
        <div>
          <FaFire color='#F85A16' size={"1.6rem"} />
          <span className="days-concluds">2 dias consecutivos</span>
        </div>
        <span className="text-user-motivation">Continue assim, aos poucos você está criando o hábito de estudar!!</span>
        <div className="line"></div>

        <div className="header-schedule">
          <h4>Tarefas</h4>
          <div className="date-conteiner">
            <span className="day-number">20</span>
            <div className="conteiner-y-m-dtext">
              <span>Sabado</span>
              <div className='mouth-year-conteiner'>
                <span>Jan</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>
        <div className="list-tasks-in-schedule">
          {previousTasksList?.map((task, index) => <Task
            key={index}
            task={task}
            toDeleteTask={(taskId) => deleteTask(taskId)}
          />)}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;