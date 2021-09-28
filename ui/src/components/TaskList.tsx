import React from "react";
import { ITask } from "../interfaces/ITask";
import classnames from 'classnames';


// // interface TodoListProps{

// // 	todos: any[];
// // }

// export const TodoList: React.FunctionComponent = (props: any) => {

// 	// props.todos 

// 	return (
// 		<div className="todoList">
//       {props.todos.map((task) => {
//         return (
//           <li key={task.id} className='list'>
//             <span className='repo-text'>{task.title} </span>
//             {/* <span className='repo-description'>{repo.description}</span> */}
//           </li>
//         );
//       })}

// 		</div>
// 	);
// }

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
		if (props.updating.yes)
			return ;
		props.deleteTask(id);
	}

	// let idOfUpdating: string;
	const handleEdit = (task: ITask) => {
		if (props.updating.yes && task.id !== props.selectedElement.id)
			return ;
		props.updateTask(task);
		// idOfUpdating = task.id;
		// alert(task.id);
		// return task.id;
	}




	return (
		<ul className="taskList">
			
      {Array.isArray(props.tasks) && props.tasks.map((task) => {

			const editButtonValue = props.updating.yes && props.selectedElement.id === task.id ? 'отмена' : 'ред.' 
		  	const completedClassNames = classnames({
				'taskList__item': true,
				'item-completed': task.completed === true,
				// 'item-updating': props.updating.yes && (idOfUpdating !== task.id ),
			});
			const titleClassNames = classnames({
				'taskList__item-title': true,
				'item-title-updating': props.updating.yes,
				'item-titte-selected': props.updating.yes && (props.selectedElement.id === task.id )
			});
			const editButtonClassNames = classnames({
				'editButton': !task.completed,
				'editButton-none': task.completed,
				'editButton-updating': props.updating.yes && (props.selectedElement.id !== task.id )
			});
			const deleteButtonClassNames = classnames({
				'deleteButton': true,
				'deleteButton-updating': props.updating.yes
			});
			console.log('dd', task.completed)
			console.log('sd', props.selectedElement.id);
        	return (
				<li className={classnames(completedClassNames)} key={task.id}>
					<input className='taskList__item-checkbox' type="checkbox" onChange={() => props.checkAsComplete(task)} checked={task.completed}/>
					<span className={titleClassNames}>{task.title}</span>
					<span className='taskList__item-datetime'>(time: {task.datetime}, </span>
					<span className='taskList__item-id'>id: {task.id})</span>
					{/* <span className='taskList__item-id'>com:{task.completed}</span> */}

					<span className={classnames(deleteButtonClassNames)} onClick={() => handleDelete(task.id)}>удал.</span>
					<span className={classnames(editButtonClassNames)} onClick={() => handleEdit(task)}>{editButtonValue}</span>

				</li>
        );
      })}

		</ul>
	);
}