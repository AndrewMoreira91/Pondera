import './Pomodoro.css'
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../../../services/axios';
import convertSecondsToFormattedTime from '../../../utils/formattedTime';
import { TimerContext } from '../../../context/TimerContext';

import Timer from '../../../components/Timer/Timer';
import Button from '../../../components/Button/Button';
import TaskConteier from '../../../components/TaksConteiner/TasksConteiner';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';

import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

let timerInterval = null;
let intervalPost = null;

function Pomodoro() {
  const { togleContextTime, timeInSeconds, setTimeInSeconds} = useContext(TimerContext)

  const [isPaused, setIsPaused] = useState(true);
  const [timeCompleted, setTimeCompleted] = useState(JSON.parse(localStorage.getItem('timeCompleted')) || 0);

	const startAudio = new Audio('/start.mp3');
	const stopAudio = new Audio('/stop.mp3');
  
  const queryClient = useQueryClient();

  useQuery('users', async () => {
    const res = await api.get('/users/1')
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
        return togleContextTime();
      }
      return prevTimeInSeconds - 1;
    });
    setTimeCompleted((prevTimeCompleted) => {
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
    intervalPost = setInterval(updateTimeCompletedInDB, 1000 * 60) // 1 minute
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

  useQuery('tasks', async () => {
    const res = await api.get('/tasks')
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute 
  })
  const previousTasksList = queryClient.getQueryData('tasks')
  const [idNewTask, setIdNewTask] = useState(0)

  const mutationPost = useMutation(newTask => api.post('/tasks', newTask))
  function createTask(taskDescription) {
    if (!taskDescription) return
    mutationPost.mutateAsync({ description: taskDescription })
      .then(response => {
        setIdNewTask(response.data.insertId)
      })
    queryClient.setQueryData('tasks', () => {
      return [...previousTasksList, { id: idNewTask, description: taskDescription }]
    })
  }

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

  function toChangeTime() {
    togleContextTime()
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      setIsPaused(true);
    }
  }

  return (
    <div className="pomodoro-conteiner">
      <div className="timer-conteiner conteiner-background">
        <Timer minutesAndSecondsFormated={convertSecondsToFormattedTime(timeInSeconds)} />
        <div className="controls-buttons">
          <Button > <LuTimerReset /> </Button>
          <Button backgroundColor={'#E88A1A'} onClick={startTimer} > {isPaused ? <FaPlay /> : <FaPause />} </Button>
          <Button onClick={toChangeTime} > <TbPlayerTrackNextFilled /> </Button>
        </div>
      </div>
      <div className="conteiner-info-session">
        <div className='daily-progress-conteiner conteiner-background'>
          <h2>Andamento diário</h2>
          <ProgressBar timeCompleted={timeCompleted} dailyTimeGoal={dailyTimeGoal} />
          <span>Concluído: {convertSecondsToFormattedTime(timeCompleted).hourAndMinutes}</span>
        </div>
        <div className='conteiner-background sequence-conteiner'>
          <h2>Sequência de 71 dias</h2>
          <span>Ontem você teve um tempo de </span>
        </div>

        <TaskConteier
          taskList={previousTasksList}
          toDeleteTask={(taskId) => deleteTask(taskId)}
          toCreateTask={(taskDescription) => createTask(taskDescription)}
        />

      </div>
    </div>
  );
}

export default Pomodoro;