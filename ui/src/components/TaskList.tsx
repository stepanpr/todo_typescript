import React from "react";
import { ITask } from "../interfaces/ITask";
import classnames from 'classnames';



interface TaskListProps{

	tasks: ITask[];
	deleteTask(id: string): void;
	updating: any;
	updateTask(task: ITask): void;
	checkAsComplete(task: ITask): void;
	selectedElement: ITask;
}

export const TaskList: React.FunctionComponent<TaskListProps> = (props) => {

	const handleDelete = (id: string) => {
		if (props.updating.isChange)
			return ;
		props.deleteTask(id);
	}

	const handleEdit = (task: ITask) => {
		if (props.updating.isChange && task.id !== props.selectedElement.id)
			return ;
		props.updateTask(task);
	}

	return (
		<ul className="taskList">
			
      {Array.isArray(props.tasks) && props.tasks.map((task) => {

			const editButtonValue = props.updating.isChange && props.selectedElement.id === task.id ? 'отмена' : 'ред.' 
		  	const completedClassNames = classnames({
				'taskList__item': true,
				'item-completed': task.completed === true,
				// 'item-updating': props.updating.yes && (idOfUpdating !== task.id ),
			});
			const titleClassNames = classnames({
				'taskList__item-title': true,
				'item-title-updating': props.updating.isChange,
				'item-titte-selected': props.updating.isChange && (props.selectedElement.id === task.id )
			});
			const editButtonClassNames = classnames({
				'editButton': !task.completed,
				'editButton-none': task.completed,
				'editButton-updating': props.updating.isChange && (props.selectedElement.id !== task.id )
			});
			const deleteButtonClassNames = classnames({
				'deleteButton': true,
				'deleteButton-updating': props.updating.isChange
			});
			console.log('dd', task.completed)
			console.log('sd', props.selectedElement.id);
        	return (
				<li className={classnames(completedClassNames)} key={task.id}>
					<input className='taskList__item-checkbox' type="checkbox" onChange={() => props.checkAsComplete(task)} checked={task.completed}/>
					<span className={titleClassNames}>{task.title}</span>
					<span className='taskList__item-datetime'>дата: {task.datetime}, </span>
					<span className='taskList__item-id'>id: {task.id}</span>
					{/* <span className='taskList__item-id'>com:{task.completed}</span> */}

					<span className={classnames(deleteButtonClassNames)} onClick={() => handleDelete(task.id)}>удал.</span>
					<span className={classnames(editButtonClassNames)} onClick={() => handleEdit(task)}>{editButtonValue}</span>

				</li>
        );
      })}

		</ul>
	);
}