import React from "react";
import { ITask } from "../interfaces/ITask";


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
}

export const TodoList: React.FunctionComponent<TasksProps> = (props) => {

	const handleDelete = (id: string) => {
		props.deleteTask(id)
	}

	return (
		<div className="taskList">
			
      {Array.isArray(props.tasks) && props.tasks.map((task) => {
        return (
          <li className='taskList__item' key={task.id}>
			<input className='taskList__item-checkbox' type="checkbox" checked={task.completed}/>
            <span className='taskList__item-title'>{task.title}</span>
            <span className='taskList__item-datetime'>(time: {task.datetime}, </span>
            <span className='taskList__item-id'>id: {task.id})</span>
			<span className='deleteButton' onClick={() => handleDelete(task.id)}>del</span>

          </li>
        );
      })}

		</div>
	);
}