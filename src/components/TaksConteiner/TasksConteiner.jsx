/* eslint-disable react/prop-types */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Input from '../Input/Input';
import Task from '../Task/Task';
import './TasksConteiner.css';
import api from '../../services/axios';
import { useState } from 'react';
import { useContext } from 'react';
import { TimerContext } from '../../context/TimerContext';

const TaskConteier = (props) => {
	const { checkContext, timeInSeconds } = useContext(TimerContext)
	
	const queryClient = useQueryClient()
		
	useQuery('tasks', async () => {
		const res = await api.get('/tasks')
		return res.data
	}, {
		staleTime: 1000 * 60 // 1 minute 
	})
	const taskList = queryClient.getQueryData('tasks')
	
	const [idNewTask, setIdNewTask] = useState(0)
	const mutationPost = useMutation(newTask => api.post('/tasks', newTask))
	
	if (timeInSeconds === 0 && !checkContext) {
		taskList.forEach(task => {
			if (task.active) {
				task.is_done = 1
			}
		})
		console.log(taskList)
	}

	function createTask(taskDescription) {
		if (!taskDescription) return
		mutationPost.mutateAsync({ description: taskDescription })
			.then(response => {
				setIdNewTask(response.data.insertId)
			})
		queryClient.setQueryData('tasks', () => {
			return [...taskList, { id: idNewTask, description: taskDescription }]
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
			return taskList.filter(task => task.id !== taskId)
		})
	}

	function changeTaskActive(taskActive) {
		taskList.forEach(task => {
			if (task.id === taskActive.id) {
				task.active = true
				props.toChangeTaskInProgres(task.description)
			} else {
				task.active = false
			}
		});
		queryClient.setQueryData('tasks', taskList)
	}

	function toClearAllTasks() {
		api.delete('/tasks')
		queryClient.setQueryData('tasks', [])
	}

	function toClearAllTasksDone() {
		// instance.delete('/tasks/done')

		const previousTasks = queryClient.getQueryData('tasks')
		queryClient.setQueryData('tasks', () => {
			return previousTasks.filter(task => task.isDone !== 1)
		})
	}

	return (
		<div className='tasks-conteiner conteiner-background'>
			<h4 className='label-new-task'>Crie uma nova tarefa</h4>
			<Input toCreateTask={taskDescription => createTask(taskDescription)} />
			<div className='content-tasks'>
				<div className='taskslist-label-conteiner'>
					<span>Selecione a tarefa para a sua sessão de concentração</span>
					<div className='tasks-list-conteiner'>
						{props.toErrorGetTask && <span>Erro ao carregar tarefas</span>}
						{taskList?.map((task, index) => {
							return <Task
								key={index}
								task={task}
								toDeleteTask={taskId => deleteTask(taskId)}
								changeTaskActive={(task) => changeTaskActive(task)}
							/>
						})}
					</div>
				</div>
				<div className='conteiner-buttons-footer-tasks'>
					<button onClick={toClearAllTasksDone} className='button-footer-clear-tasks clear-all-tasks-concluded'>Apagar todas as tarefas concluídas</button>
					<button onClick={toClearAllTasks} className='button-footer-clear-tasks clear-all-tasks'>Apagar todas as tarefas</button>
				</div>
			</div>
		</div>
	);
}

export default TaskConteier;