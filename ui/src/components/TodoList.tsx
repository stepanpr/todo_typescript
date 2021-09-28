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

interface TasksProps{

	tasks: ITask[];
	deleteTask(id: string): void;
	updateTask(task: ITask): void;
	checkAsComplete(task: ITask): void;
}

export const TodoList: React.FunctionComponent<TasksProps> = (props) => {

	const handleDelete = (id: string) => {
		props.deleteTask(id);
	}

	const handleEdit = (task: ITask) => {
		props.updateTask(task);
	}




	return (
		<div className="taskList">
			
      {Array.isArray(props.tasks) && props.tasks.map((task) => {
		  	const completedClassNames = classnames({
				'taskList__item': true,
				'item-completed': task.completed === true, 
			})
			console.log('dd', task.completed)
        	return (
				<li className={classnames(completedClassNames)} key={task.id}>
					<input className='taskList__item-checkbox' type="checkbox" onChange={() => props.checkAsComplete(task)} checked={task.completed}/>
					<span className='taskList__item-title'>{task.title}</span>
					<span className='taskList__item-datetime'>(time: {task.datetime}, </span>
					<span className='taskList__item-id'>id: {task.id})</span>
					{/* <span className='taskList__item-id'>com:{task.completed}</span> */}

					<span className='deleteButton' onClick={() => handleDelete(task.id)}>del</span>
					<span className='editButton' onClick={() => handleEdit(task)}>edit</span>

				</li>
        );
      })}

		</div>
	);
}