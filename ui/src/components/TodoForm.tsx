import React, { useState } from "react";

interface TodoFormProps {
	addTask(title: string): void;
}

// export const FormTodo: React.FunctionComponent<{addTodo(title: string): void}> = (props) => {
 export const TodoForm: React.FunctionComponent<TodoFormProps> = (props) => {


	const[ title, setTitle ] = useState<string>('');

	const hadleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleEnter = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter')
			props.addTask(title);
			// console.log(title);
			// addNew();
	}

	const handleClick = () => {
		props.addTask(title);
	}

	return (
		<div className="todoForm">
			{/* <label htmlFor="title">Новая зачача: </label> */}
			<div className="todoForm_sendBox">
				<input onChange={hadleChange} onKeyPress={handleEnter} type="text" id="title" autoFocus={true} value={title} placeholder="Введите новую задачу" ref={input => input && input.focus()}/>
				<button onClick={handleClick}>Добавить</button>
			</div>
		</div>
	);
}

// export default FormTodo;