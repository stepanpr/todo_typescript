import React, {  useState, useReducer, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import './App.css';
import axios from 'axios';
import { ITask } from './interfaces/ITask'
import { IUpdating } from './interfaces/IUpdating'
import { Header } from './components/Header'


// curl -d '{"id":"value1", "title":"value2", "completed":"true"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tasks/create

function initialTasks() {
	return([
		// { id: '000', title: 'empty', completed: false, datetime: null},
	]);
}

enum ActionTypes {
	copyTasks = 'copyTasks',
	deleteCompleteds = 'deleteCompleteds'
}

function reducerTasks(state: ITask[], action: any ) {

	switch (action.type) {
		case ActionTypes.copyTasks: {
			const tasks  = action.tasks;
			const newTasks = tasks.map((a : ITask) => ({...a}));
			return newTasks;
		}
		case ActionTypes.deleteCompleteds: {
			const deleteTask = action.deleteTask;
			const newTasks = state.map((task: ITask) => {
				if (task.completed === true)
					deleteTask(task.id);
				return task;
			});
			return newTasks;
		}
		default: 
			return state;
	}

}


const App: React.FunctionComponent = () => {

	let tasksList: ITask[] = [];
	const [tasks, dispatchTasks] = useReducer(reducerTasks, tasksList, initialTasks);
	const [updating, setUpdating] = useState<IUpdating>({ yes: false, value: '', })
	const initSelectedElement = {id: 'null', title: 'null', completed: false, datetime: 'null' };
	const [selectedElement, setSelectedElement] = useState<ITask>(initSelectedElement);

	const getURL='http://localhost:3000/tasks/getList';
	const postURL='http://localhost:3000/tasks/create';
	const deleteURL='http://localhost:3000/tasks/delete'; 
	const updateURL='http://localhost:3000/tasks/update';

	useEffect( () => {
		fetch(getURL)
		.then(data => data.json())
		.then((data) => dispatchTasks({type: 'copyTasks', tasks: data.items})
		)
	}, [dispatchTasks]);


	/* загрузка tasks из БД в стейт*/
	const getTasks = async () => {
		const {data} = await axios.get(getURL);
		console.log(data);
		dispatchTasks({type: 'copyTasks', tasks: data.items});
		// await fetch(getURL)
		// .then(result => result.json())
		// .then((data) => dispatchTasks({type: 'copyTasks', tasks: data.items}));
    }

	/* отправка tasks */
	const postTask = (title: string) => {

		if (title === '')
			return ;
		axios({
			method: 'post',
			url: postURL,
			data: {
				id: null,
				title: title,
				completed: false,
				datetime: null
			}
		  });
		getTasks();
    }

	/* удаление tasks */
	const deleteTask = (id: string) => {
		axios({
			method: 'delete',
			url: deleteURL,
			data: {
				id: id,
			}
		  });
		getTasks();

	}

	/* удаление завершенных tasks */
	const deleteCompletedsTasks = () => {

		if (countElements(true) > 0 && window.confirm('Вы уверены?')) {
			dispatchTasks({type: 'deleteCompleteds', deleteTask: deleteTask });
			getTasks();
		}
	}
	
	/* добвление новых и отредактированных tasks */
	const addTask = (title: string) => {

		if (title === "")
			return ;
		if (updating.yes === true) {
			axios({
				method: 'post',
				url: updateURL,
				data: {
					id: selectedElement.id,
					title: title,
					completed: selectedElement.completed,
					datetime: selectedElement.datetime
				}
			});
			setUpdating( {yes: false, value: ''});
			setSelectedElement(initSelectedElement);
			getTasks();

			return ;
		}
		postTask(title);
		getTasks();
	}

	/* редактирование */
	const updateTask = (task: ITask) => {

		if (task.id === selectedElement.id && updating.yes === true) {
			setUpdating({yes: false, value: ''});
			setSelectedElement(initSelectedElement);
			getTasks();

		} else if (task.id === selectedElement.id && updating.yes === true) {
			getTasks();
			return ;
		} else {
			getTasks();
			setUpdating( {yes: true, value: ''});
			setSelectedElement(task);
		}
	}

	/* определить задачу как выполненную */
	const checkAsComplete = (task: ITask) => {

		if (!updating.yes) {
		axios({
			method: 'post',
			url: updateURL,
			data: {
				id: task.id,
				title: task.title,
				completed: !task.completed,
				datetime: task.datetime
			}
		  });
		}
		getTasks();
	}

	/* подсчет элементов: true === выполенные, false === невыполенные */
	const countElements = (request: boolean) => {
		return tasks.reduce((sum: number, elem: ITask) => (elem.completed === request) ? sum+1 : sum, 0);
	}


	return (
		<div className="App">
			<Header sumOfIncompleteds={countElements(false)} />
			<div className="container">
				<TaskList 
					tasks={tasks} 
					deleteTask={deleteTask} 
					updating={updating} 
					updateTask={updateTask} 
					selectedElement={selectedElement} 
					checkAsComplete={checkAsComplete}
					
				/> 

				<TaskForm addTask={addTask} 
					updating={updating} 
					setUpdating={setUpdating}
					deleteCompletedsTasks={deleteCompletedsTasks}
					sumOfCompleteds={countElements(true)}
				/>
			</div>

		</div>
	);
}

export default App;
