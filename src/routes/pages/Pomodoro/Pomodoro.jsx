import './Pomodoro.css'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import secondsToTime from '../../../utils/secondsToTime';

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
  const [isBtnPause, setIsBtnPause] = useState(false);

  const countDown = () => {
    setTimeInSeconds((prevTimeInSeconds) => {
      if (prevTimeInSeconds === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        setIsBtnPause(false);
        return TIME_IN_SECONDS_DEFAULT;
      }

      return prevTimeInSeconds - 1;
    });
  }

  const startTimer = () => {
    console.log('start');
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      setIsBtnPause(false);
      return;
    }
    setIsBtnPause(true);
    timerInterval = setInterval(countDown, 1000);
  }

  const time = '1 hora e 30 minutos';
  const textSequence = 6
  const timeYesterday = '1 hora e 30 minutos'

  // Requisiçoes com a API
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
    if(mutationDelete.isError) {
      return console.log('erro ao deletar task\n ID da tasks à ser deletada:', taskId)
    }

    queryClient.setQueryData('tasks', () => {
      return previousTasks.filter(task => task.id !== taskId)
    })
  }

  return (
    <div className="pomodoro-conteiner">
      <div className="timer-conteiner conteiner-background">
        <Timer timerFormated={secondsToTime(timeInSeconds)} />
        <div className="controls-buttons">
          <Button > <LuTimerReset /> </Button>
          <Button onClick={startTimer} > {isBtnPause ? <FaPause /> : <FaPlay />} </Button>
          <Button > <TbPlayerTrackNextFilled /> </Button>
        </div>
      </div>
      <div className="conteiner-info-session">
        <div className='daily-progress-conteiner conteiner-background'>
          <h2>Andamento diário</h2>
          <ProgressBar progress={34} />
          <span>Concluído: {time}</span>
        </div>
        <div className='conteiner-background sequence-conteiner'>
          <h2>Sequência de {textSequence} dias</h2>
          <span>Ontem você teve um tempo de {timeYesterday}</span>
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