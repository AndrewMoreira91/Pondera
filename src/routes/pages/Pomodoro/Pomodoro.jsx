import './Pomodoro.css'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import convertSecondsToFormattedTime from '../../../utils/formattedTime';

import Timer from '../../../components/Timer/Timer';
import Button from '../../../components/Button/Button';

import { TbPlayerTrackNextFilled } from "react-icons/tb";
import TaskConteier from '../../../components/TaksConteiner/TasksConteiner';
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import instance from '../../../services/axios';

const TIME_IN_SECONDS_DEFAULT = 1 * 60 * 25;
let timerInterval = null;

function Pomodoro() {
  const queryClient = useQueryClient();

  const [timeInSeconds, setTimeInSeconds] = useState(TIME_IN_SECONDS_DEFAULT);
  const [timeCompleted, setTimeCompleted] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const countDown = () => {
    setTimeInSeconds((prevTimeInSeconds) => {
      if (prevTimeInSeconds === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setIsPaused(false);
        return TIME_IN_SECONDS_DEFAULT;
      }
      return prevTimeInSeconds - 1;
    });
    setTimeCompleted((prevTimeCompleted) => {
      return prevTimeCompleted + 1
    });
  }
  console.log('timeCompleted:', timeCompleted);
  
  const startTimer = () => {
    if (timerInterval) {
      console.log('Pause timer');
      clearInterval(timerInterval);
      timerInterval = null;
      setIsPaused(true);
      return;
    }
    console.log('Start timer');
    setIsPaused(false);
    timerInterval = setInterval(countDown, 1000);
  }

  // Requisiçoes com a API
 useQuery('users', async () => {
    const res = await instance.get('/users/1')
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute
  })

  const user = queryClient.getQueryData('users')
  const [dailyTimeGoal, setDailyTimeGoal] = useState(0)
  if (user && dailyTimeGoal === 0) {
    setDailyTimeGoal(user.daily_time_goal)
  }

  useQuery('tasks', async () => {
    const res = await instance.get('/tasks')
    return res.data
  }, {
    staleTime: 1000 * 60 // 1 minute 
  })

  const previousTasks = queryClient.getQueryData('tasks')
  const [idNewTask, setIdNewTask] = useState(0)

  const mutationPost = useMutation(newTask => instance.post('/tasks', newTask))
  function createTask(taskDescription) {
    if (!taskDescription) return
    mutationPost.mutateAsync({ description: taskDescription })
      .then(response => {
        setIdNewTask(response.data.insertId)
      })

    queryClient.setQueryData('tasks', () => {
      return [...previousTasks, { id: idNewTask, description: taskDescription }]
    })
  }

  const mutationDelete = useMutation(id => instance.delete('/tasks/' + id))
  function deleteTask(taskId) {
    console.log('task deletada: ', taskId)
    mutationDelete.mutateAsync(taskId)
    if (mutationDelete.isError) {
      return console.log('erro ao deletar task\n ID da tasks à ser deletada:', taskId)
    }

    queryClient.setQueryData('tasks', () => {
      return previousTasks.filter(task => task.id !== taskId)
    })
  }

  return (
    <div className="pomodoro-conteiner">
      <div className="timer-conteiner conteiner-background">
        <Timer minutesAndSecondsFormated={convertSecondsToFormattedTime(timeInSeconds)} />
        <div className="controls-buttons">
          <Button > <LuTimerReset /> </Button>
          <Button onClick={startTimer} > {isPaused ? <FaPlay /> : <FaPause />} </Button>
          <Button > <TbPlayerTrackNextFilled /> </Button>
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
          taskList={previousTasks}
          toDeleteTask={(taskId) => deleteTask(taskId)}
          toCreateTask={(taskDescription) => createTask(taskDescription)}
        />

      </div>
    </div>
  );
}

export default Pomodoro;