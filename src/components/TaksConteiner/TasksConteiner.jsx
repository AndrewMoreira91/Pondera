/* eslint-disable react/prop-types */
import { useQueryClient } from 'react-query';
import Input from '../Input/Input';
import Task from '../Task/Task';
import './TasksConteiner.css';
import instance from '../../services/axios';

const TaskConteier = (props) => {

	const queryClient = useQueryClient()

	function toClearAllTasks() {
		instance.delete('/tasks')
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
			<div>
				<span className='label-task-in-progress'>#Tarefa em andamento</span>
				<h3 className='title-task-in-progress'>Estudar react</h3>
			</div>
			<h4 className='label-new-task'>Crie uma nova tarefa</h4>
			<Input toCreateTask={taskDescription => props.toCreateTask(taskDescription)} />
			<div className='content-tasks'>
				<div className='taskslist-label-conteiner'>
					<span>Selecione a tarefa para a sua sessão de concentração</span>
					<div className='tasks-list-conteiner'>
						{props.toErrorGetTask && <span>Erro ao carregar tarefas</span>}
						{props.taskList?.map((task, index) => {
							return <Task
								key={index}
								task={task}
								toDeleteTask={taskId => props.toDeleteTask(taskId)}
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