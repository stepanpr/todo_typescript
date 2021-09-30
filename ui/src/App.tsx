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
	]);
}

enum ActionTypes {
	copyTasks = 'copyTasks',
	deleteCompleteds = 'deleteCompleteds'
}

function reducerTasks(state: ITask[], action: any ) {

	const getNewDate = (ts: string) => {

		let nd = new Date(+ts);
		let date = nd.getDate();
		let month = nd.getMonth();
		let year = nd.getFullYear();
		let hours = nd.getHours();
		let minutes = nd.getMinutes();
		let seconds = nd.getSeconds();
		return hours + ':' + minutes + ':' + seconds + ' ' + date + '/' + month + '/' + year + ' ';
	}

	switch (action.type) {
		case ActionTypes.copyTasks: {
			const tasks  = action.tasks;
			const newTasks = tasks.map((a : ITask) => ({id: a.id, title: a.title, completed: a.completed, datetime: getNewDate(a.datetime) }));
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
	const [updating, setUpdating] = useState<IUpdating>({ isChange: false })
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
    }

	/* отправка tasks */
	const postTask = async (title: string) => {

		if (title === '')
			return ;
		await axios({
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
	const deleteTask = async (id: string) => {
		await axios({
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
	const addTask = async (title: string) => {

		if (title === "")
			return ;
		if (updating.isChange === true) {
			await axios({
				method: 'post',
				url: updateURL,
				data: {
					id: selectedElement.id,
					title: title,
					completed: selectedElement.completed,
					datetime: selectedElement.datetime
				}
			});
			setUpdating( {isChange: false });
			setSelectedElement(initSelectedElement);
			getTasks();

			return ;
		}
		postTask(title);
		getTasks();
	}

	/* редактирование */
	const updateTask = (task: ITask) => {

		if (task.id === selectedElement.id && updating.isChange === true) {
			setUpdating({isChange: false});
			setSelectedElement(initSelectedElement);
			getTasks();
		} else {
			getTasks();
			setUpdating( {isChange: true});
			setSelectedElement(task);
		}
	}

	/* определить задачу как выполненную */
	const checkAsComplete = async (task: ITask) => {

		if (!updating.isChange) {
		await axios({
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
