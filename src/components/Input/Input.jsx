/* eslint-disable react/prop-types */
import { useState } from 'react';
import './Input.css';
import { IoAddOutline } from "react-icons/io5";


const Input = (props) => {

	const [taskDescription, setTaskDescription] = useState('');

	function toClick(taskDescription) {
		props.toCreateTask(taskDescription);
		setTaskDescription('');
	}

	const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
			console.log('Botão enter apertado')
			toClick(taskDescription)
    }
  }

	return (
		<div className='input-component-conteiner'>
			<input
				type="text"
				placeholder="Adicionar uma tarefa"
				value={taskDescription}
				onChange={(e) => setTaskDescription(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<IoAddOutline onClick={() => toClick(taskDescription)} className='button-new-task-icon' />
		</div>
	);
}

export default Input;