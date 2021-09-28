import React, { useState, useEffect } from "react";
import classnames from 'classnames';
import { IUpdating } from "../interfaces/IUpdating";


interface TodoFormProps {
	addTask(title: string): void;
	updating: any;
	deleteCompletedsTasks(): void;
	setUpdating(updating: IUpdating): void;
}

// export const FormTodo: React.FunctionComponent<{addTodo(title: string): void}> = (props) => {
 export const TodoForm: React.FunctionComponent<TodoFormProps> = (props) => {


	const[ title, setTitle ] = useState<string>('');

	useEffect(() => {
		const handleEscPress = (event: any) => {
			if (event.keyCode === 27)
				props.setUpdating({yes: false, value: ''});
		}
		window.addEventListener("keydown", handleEscPress);
		return () => {
		  window.removeEventListener("keydown", handleEscPress);
		};
	  }, []);

	const hadleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter') {
			props.addTask(title);
			setTitle('');
		}
		// if(event.key === 'Escape')
		// 	alert(3);
			// console.log(title);
			// addNew();
	}


	// onKeyDown={handleEscPress} 
	// const handleEscPress = function(e: any) {
	// 	  if (e.keyCode === 27) {
	// 		props.setUpdating({yes: false, value: ''});
	// 	  }
	// 	}
	  

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

	const labelClassNames = classnames({
		'todoForm_input-label': true,
		'todoForm_input-label-none': !props.updating.yes,
	});

	return (
		<div className="todoForm">
			<label className={classnames(labelClassNames)} htmlFor="title">Отредактируйте задачу или нажмите ESC для отмены...</label>
			<div className="todoForm_sendBox">
				<input className={inputClassNames} onChange={hadleChange} onKeyPress={handleKeyPress} type="text" id="title" autoFocus={true} value={title} placeholder="Введите новую задачу" ref={input => input && input.focus()}/>
				<button className={buttonClassNames} onClick={handleClick}>{buttonValue}</button>
			</div>
			<div className="todoForm_actionBox">
				<button className='todoForm_buttonDeleteAll' onClick={props.deleteCompletedsTasks}>Удалить завершенные</button>
			</div>

		</div>
	);
}

// export default FormTodo;