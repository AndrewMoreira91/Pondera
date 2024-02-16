/* eslint-disable react/prop-types */
import './Task.css';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import api from '../../services/axios';

const Task = (props) => {
	const [isEditing, setIsEditing] = useState(false)

	const [valueDescription, setValueDescription] = useState(props.task.description)
	const queryClient = useQueryClient()

	
	function toEditTask() {
		setIsEditing(false)
		api.put('/tasks/' + props.task.id, {
			description: valueDescription,
			isDone: 0
		})
		
		const previousTasks = queryClient.getQueryData('tasks')
		const newTasksList = previousTasks.map(task => {
			if(task.id === props.task.id) {
				return {...task, description: valueDescription}
			}
			return task
		})
		console.log(newTasksList)
		queryClient.setQueryData('tasks', newTasksList)
	}

	return (
		<div className='task-component-conteiner'>
			{isEditing ?
				<>
					<input value={valueDescription} onChange={e => setValueDescription(e.target.value)} className='input-edit-task' />
					<FaCheck onClick={toEditTask} className='button-task' />
				</>
				:
				<>
					<span>{props.task.description}</span>
					<div className='icons-button-tasks-conteiner'>
						<MdOutlineModeEditOutline onClick={() => setIsEditing(true)} className='button-task' />
						<MdDeleteForever onClick={() => props.toDeleteTask(props.task.id)} className='button-task button-delete-task' />
					</div>
				</>
			}

		</div >
	);
}

export default Task;
