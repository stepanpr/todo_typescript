import React, { useState, useEffect } from "react";
import classnames from 'classnames';
import { IUpdating } from "../interfaces/IUpdating";


interface TaskFormProps {
	addTask(title: string): void;
	updating: any;
	deleteCompletedsTasks(): void;
	setUpdating(updating: IUpdating): void;
	sumOfCompleteds: number;
}

export const TaskForm: React.FunctionComponent<TaskFormProps> = (props) => {

	const[ title, setTitle ] = useState<string>('');

	useEffect(() => {
		const handleEscPress = (event: any) => {
			if (event.keyCode === 27)
				props.setUpdating({ isChange: false });
		}
		window.addEventListener("keydown", handleEscPress);
		return () => {
		  window.removeEventListener("keydown", handleEscPress);
		};
	  });

	const hadleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter') {
			props.addTask(title);
			setTitle('');
		}
	}

	const handleClick = () => {
		props.addTask(title);
		setTitle('');
	}

	const buttonValue = props.updating.isChange ? 'Применить изменения' : 'Добавить задачу';

	const inputClassNames = classnames({
		'todoForm_input': true,
		'input-updating': props.updating.isChange,
	});
	
	const buttonClassNames = classnames({
		'todoForm_buttonAdd': true,
		'buttonAdd-updating': props.updating.isChange,
	});

	const labelClassNames = classnames({
		'todoForm_input-label': true,
		'todoForm_input-label-none': !props.updating.isChange,
	});

	const deleteAllButtonClassNames = classnames({
		'todoForm_buttonDeleteAll': true,
		'todoForm_buttonDeleteAll-inactive': props.sumOfCompleteds <= 0,
	})

	

	return (
		<div className="todoForm">
			<label className={classnames(labelClassNames)} htmlFor="title">Отредактируйте задачу или нажмите ESC для отмены...</label>
			<div className="todoForm_sendBox">
				<input className={inputClassNames} onChange={hadleChange} onKeyPress={handleKeyPress} type="text" id="title" autoFocus={true} value={title} placeholder="Введите новую задачу" ref={input => input && input.focus()}/>
				<button className={buttonClassNames} onClick={handleClick}>{buttonValue}</button>
			</div>
			<div className="todoForm_actionBox">
				<button className={classnames(deleteAllButtonClassNames)} onClick={props.deleteCompletedsTasks}>Удалить завершенные</button>
			</div>

		</div>
	);
}
