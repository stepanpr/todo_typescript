import React, { useState } from "react";
import classnames from 'classnames';


interface TodoFormProps {
	addTask(title: string): void;
	updating: any;
	deleteCompletedsTasks(): void;
}

// export const FormTodo: React.FunctionComponent<{addTodo(title: string): void}> = (props) => {
 export const TodoForm: React.FunctionComponent<TodoFormProps> = (props) => {


	const[ title, setTitle ] = useState<string>('');

	const hadleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleEnter = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter') {
			props.addTask(title);
			setTitle('');
		}
			// console.log(title);
			// addNew();
	}

	const handleClick = () => {
		props.addTask(title);
		setTitle('');
	}

	const buttonValue = props.updating.yes ? 'Применить изменения' : 'Добавить задачу';

	const inputClassNames = classnames({
		'todoForm_input': true,
		'input-updating': props.updating.yes,
	});
	
	const buttonClassNames = classnames({
		'todoForm_buttonAdd': true,
		'buttonAdd-updating': props.updating.yes,
	});

	return (
		<div className="todoForm">
			{/* <label htmlFor="title">Новая зачача: </label> */}
			<div className="todoForm_sendBox">
				<input className={inputClassNames} onChange={hadleChange} onKeyPress={handleEnter} type="text" id="title" autoFocus={true} value={title} placeholder="Введите новую задачу" ref={input => input && input.focus()}/>
				<button className={buttonClassNames} onClick={handleClick}>{buttonValue}</button>
			</div>
			<div className="todoForm_actionBox">
				<button className='todoForm_buttonDeleteAll' onClick={props.deleteCompletedsTasks}>Удалить завершенные</button>
			</div>

		</div>
	);
}

// export default FormTodo;