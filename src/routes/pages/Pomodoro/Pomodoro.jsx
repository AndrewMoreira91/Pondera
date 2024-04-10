import './Pomodoro.css'
import { useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import api from '../../../services/axios';
import convertSecondsToFormattedTime from '../../../utils/formattedTime';
import { TimerContext } from '../../../context/TimerContext';

import Timer from './components/Timer/Timer';
import TaskConteier from './components/TaksConteiner/TasksConteiner';
import Button from '../../../components/Button/Button';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';

import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

let timerInterval = null;
let intervalPost = null;

function Pomodoro() {
  const { togleContextTime, timeInSeconds, setTimeInSeconds, changeTime, contextTime } = useContext(TimerContext)

  const [theme, setTheme] = useState(contextTime === 'focus' ? 'focus' : 'rest');

  const [isPaused, setIsPaused] = useState(true);
  const [timeCompleted, setTimeCompleted] = useState(JSON.parse(localStorage.getItem('timeCompleted')) || 0);

  const TASKDEFAULTINPROGRESS = 'Nenhuma tarefa em andamento'
  const [taskInProgress, setTaskInProgress] = useState(TASKDEFAULTINPROGRESS)

  const [dots, setDots] = useState('')

  const startAudio = new Audio('/start.mp3');
  const stopAudio = new Audio('/stop.mp3');

  const queryClient = useQueryClient();

  useQuery('tasks', async () => {
    const res = await api.get('/tasks')
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute 
  })
  let taskList = []
  taskList = queryClient.getQueryData('tasks')

  async function changeTasksInBd(task) {
    await api.put(`/tasks/${task.id}`, { description: task.description, isDone: task.is_done })
  }

  async function changeTaskCompleted() {
    taskList.forEach(task => {
      if (task.active) {
        task.active = false
        task.is_done = 1
        changeTasksInBd(task)
      }
    })
    queryClient.setQueryData('tasks', taskList)
  }

  useQuery('users', async () => {
    const res = await api.get('/users/1')
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log('Erro ao fazer a requisição do usuario ', error)
      })
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute
  })
  const user = queryClient.getQueryData('users')

  const [dailyTimeGoal, setDailyTimeGoal] = useState(0)
  if (user && dailyTimeGoal === 0) {
    setDailyTimeGoal(user.daily_time_goal)
  }

  useQuery('dailyLogs', async () => {
    const res = await api.get('/dailyLogs/last/1')
    return res.data
  }, {
    staleTime: 1000 * 60 * 5 // 5 minutes
  })

  const countDown = () => {
    setTimeInSeconds((prevTimeInSeconds) => {
      if (prevTimeInSeconds === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setIsPaused(true);
        contextTime === 'focus' ? changeTaskCompleted() : null;
        return togleContextTime();
      }
      return prevTimeInSeconds - 1;
    });
    setTimeCompleted((prevTimeCompleted) => {
      treeDots();
      return prevTimeCompleted + 1
    });
  }
  localStorage.setItem('timeCompleted', JSON.stringify(timeCompleted))

  useEffect(() => {
    function updateTimeCompletedInDB() {
      if (intervalPost) {
        clearInterval(intervalPost);
      }
      const timeCompletedInLocalStorage = JSON.parse(localStorage.getItem('timeCompleted'))
      api.put('/dailyLogs/updateTime/1', { timeCompleted: timeCompletedInLocalStorage })
    }
    intervalPost = setInterval(updateTimeCompletedInDB, 1000 * 15) // 15 seconds
  }, [])

  const startTimer = () => {
    if (timerInterval) {
      console.log('Pause timer');
      stopAudio.play();
      clearInterval(timerInterval);
      timerInterval = null;
      setIsPaused(true);
      return;
    }
    console.log('Start timer');
    startAudio.play();
    setIsPaused(false);
    timerInterval = setInterval(countDown, 1000);
  }

  function toChangeTime() {
    const newTheme = theme === 'focus' ? 'rest' : 'focus';
    setTheme(newTheme);
    togleContextTime()
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      setIsPaused(true);
    }
  }

  function toResetTimer() {
    changeTime();
    clearInterval(timerInterval);
    timerInterval = null;
    setIsPaused(true);
  }

  function treeDots() {
    setDots(prevDots => {
      if (prevDots === '...') {
        return '.'
      } else {
        return prevDots + '.'
      }
    })
  }

  return (
    <div className="pomodoro-conteiner" data-theme={theme}>
      <div className="timer-conteiner conteiner-background"
        style={contextTime === 'rest' ? { borderColor: 'var(--mimolette-orange)' } : {borderColor: 'transparent'} }
      >
        <Timer minutesAndSecondsFormated={convertSecondsToFormattedTime(timeInSeconds)} />
        <div className="controls-buttons">
          <Button onClick={toResetTimer} > <LuTimerReset /> </Button>
          <Button backgroundColor={'var(--mimolette-orange)'}
            onClick={startTimer} >
            {isPaused ? <FaPlay /> : <FaPause />}
          </Button>
          <Button onClick={toChangeTime} > <TbPlayerTrackNextFilled /> </Button>
        </div>
      </div>
      <div className="conteiner-info-session">
        <div className='conteiner-background'>
          <span className='label-task-in-progress'>Tarefa em andamento:</span>
          <h3 className='title-task-in-progress'># {contextTime === 'focus' ? taskInProgress : `Descansando${dots}`}</h3>
        </div>
        <div className='daily-progress-conteiner conteiner-background'>
          <h2>Andamento diário</h2>
          <ProgressBar timeCompleted={timeCompleted} dailyTimeGoal={dailyTimeGoal} />
          <span>Concluído: {convertSecondsToFormattedTime(timeCompleted).hourAndMinutes}</span>
        </div>
        <div className='conteiner-background sequence-conteiner'>
          <h2>Sequência de 71 dias</h2>
          <span>Ontem você teve um tempo de </span>
        </div>

        <TaskConteier toChangeTaskInProgres={task => setTaskInProgress(task)} />

      </div>
    </div>
  );
}

export default Pomodoro;