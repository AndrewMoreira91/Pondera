/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import './TasksConteiner.css';
import Input from '../../../../../components/Input/Input';
import Task from '../../../../../components/Task/Task';
import api from '../../../../../services/axios';
import { useState } from 'react';

Modal.setAppElement('#root');

const TaskConteier = (props) => {
	const [modalIsOpen, setModalIsOpen] = useState(false)

	function openModal() {
		setModalIsOpen(true)
	}

	function closeModal() {
		setModalIsOpen(false)
	}

	const queryClient = useQueryClient()

	useQuery('tasks', async () => {
		const res = await api.get('/tasks')
		return res.data
	}, {
		staleTime: 1000 * 60 // 1 minute 
	})
	let taskList = []
	taskList = queryClient.getQueryData('tasks')

	const mutationPost = useMutation(newTask => api.post('/tasks', newTask))

	function createTask(taskDescription) {
		if (!taskDescription) return
		mutationPost.mutateAsync({ description: taskDescription })
			.then(response => {
				// setIdNewTask(response.data.insertId)
				queryClient.setQueryData('tasks', () => {
					return [...taskList, { id: response.data.insertId, description: taskDescription }]
				})
			})
	}

	const mutationDelete = useMutation(id => api.delete('/tasks/one/' + id))
	function deleteTask(taskId) {
		mutationDelete.mutateAsync(taskId)
		if (mutationDelete.isError) {
			return console.log('erro ao deletar task\n ID da tasks à ser deletada:', taskId)
		}

		const newListTasks = taskList.filter(task => task.id !== taskId)

		queryClient.setQueryData('tasks', newListTasks)
		taskList = newListTasks
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
		closeModal()
		api.delete('/tasks/all')
		queryClient.setQueryData('tasks', [])
	}

	function toClearAllTasksDone() {
		const newTaskList = taskList.filter(task => task.is_done !== 1)
		queryClient.setQueryData('tasks', newTaskList)
		api.delete('/tasks/done')
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
					<button onClick={() => openModal()} className='button-footer-clear-tasks clear-all-tasks'>Apagar todas as tarefas</button>
				</div>
			</div>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel='Apagar todas as tarefas'
				className={'modal-task'}
				overlayClassName={'overlay-task'}
			>
				<div className='modal-task-header'>
					<h2>Tem certeza que deseja apagar todas as tarefas?</h2>
				</div>
				<div className='modal-task-content'>
						<span className='warning-text'>Se você excluir, não conseguirá recuperar novamente as tarefas</span>
						<span className='confirm-text'>Deseja continuar?</span>
				</div>
				<div className='modal-task-footer'>
					<button onClick={toClearAllTasks} className='button-footer-clear-tasks-confirm'>Apagar todas as tarefas</button>
					<button onClick={closeModal} className='button-footer-clear-tasks-cancel'>Cancelar</button>
				</div>
			</Modal>
		</div>
	);
}

export default TaskConteier;