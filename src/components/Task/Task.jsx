/* eslint-disable react/prop-types */
import './Task.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useContext, useState } from 'react';
import { useQueryClient } from 'react-query';
import api from '../../services/axios';
import { TimerContext } from '../../context/TimerContext';

const Task = ({ task, changeTaskActive, toDeleteTask }) => {
	const [isEditing, setIsEditing] = useState(false)

	const [valueDescription, setValueDescription] = useState(task.description)
	const queryClient = useQueryClient()

	const { contextTime } = useContext(TimerContext)

	function toEditTask() {
		setIsEditing(false)
		api.put('/tasks/' + task.id, {
			description: valueDescription,
			isDone: 0
		})

		const previousTasks = queryClient.getQueryData('tasks')
		const newTasksList = previousTasks.map(previousTask => {
			if (previousTask.id === task.id) {
				return { ...previousTask, description: valueDescription }
			}
			return previousTask
		})
		console.log(newTasksList)
		queryClient.setQueryData('tasks', newTasksList)
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			toEditTask()
		}
	}

	function toClickInTask() {
		changeTaskActive(task)
	}

	let styleSelected = {}
	const styles = {
		activeStyle: {
			border: "1px",
			borderColor: "#E88A1A",
			borderStyle: "solid"
		},
		completedStyle: {
			backgroundColor: '#4E9165'
		}
	}

	if (task.active && contextTime === 'focus') {
		styleSelected = styles.activeStyle
	}
	if (task.is_done) {
		styleSelected = styles.completedStyle
	}

	return (
		<div
			onBlur={() => toEditTask()}
			onClick={toClickInTask}
			style={styleSelected}
			className='task-component-conteiner'
		>
			{isEditing ?
				<>
					<input
						value={valueDescription}
						onChange={e => setValueDescription(e.target.value)}
						className='input-edit-task'
						onKeyDown={handleKeyDown}

					/>
					<FaCheck onClick={toEditTask} className='button-task' />
				</>
				:
				<>
					<span>{task.description}</span>
					{task.isDone ? null :
						<div className='icons-button-tasks-conteiner'>
							<MdOutlineModeEditOutline onClick={() => setIsEditing(true)} className='button-task' />
							<MdDeleteForever onClick={() => toDeleteTask(task.id)} className='button-task button-delete-task' />
						</div>
					}
				</>
			}

		</div >
	);
}

export default Task;
