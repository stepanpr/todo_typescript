import React, {  useState, useReducer, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import './App.css';
import axios from 'axios';
import { ITask } from './interfaces/ITask'
import { IUpdating } from './interfaces/IUpdating'


// curl -d '{"id":"value1", "title":"value2", "completed":"true"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tasks/create


function initialTasks() {
	return([
		// { id: '000', title: 'empty', completed: false, datetime: null},
		// { id: '1', title: 'todo2', completed: false, datetime: 222},
	]);
}

enum ActionTypes {
	copyTasks = 'copyTasks',
	deleteCompleteds = 'deleteCompleteds'
}

function reducerTasks(state: ITask[], action: any ) {
	switch (action.type) {
		// case 'addTask': {
		// 	const { title } = action.payload; 
		// 	console.log('addTodo state:', state);
		// 	console.log('addTodo:', title);
		// 	return [
		// 		...state, 
		// 		{
		// 			id: 2,
		// 			title: title,
		// 			completed: false,
		// 			datetime: 64
		// 		}
		// 	];
		// }
		
		case ActionTypes.copyTasks: {
			
			const tasks  = action.tasks;
			// let newTasks = tasks.slice();
			const newTasks = tasks.map((a : ITask) => ({...a}));
			// console.log();

			return newTasks;
		}
		case ActionTypes.deleteCompleteds: {
			const deleteTask = action.deleteTask;
			const newTasks = state.map((task: ITask) => {
				// console.log('4444', task.completed);
				if (task.completed === true)
					deleteTask(task.id);
				return task;
			})
			return newTasks;
		}
		// case 'setCompleted': {
		// 	const id = action.id;
		// alert(id);

		// 	let newTasks = state.map((task: ITask) => {
		// 		// alert(task.completed)
		// 		if (task.id === id) {
		// 			task.completed = !task.completed;
		// 		}
		// 		return task;
		// 	});
		// 	return newTasks;
		// }
		default: 
			return state;
	}

}


const App: React.FunctionComponent = () => {


	let tasksList: ITask[] = [];
	// const [tasks, setTodos] = useState([]);
	const [tasks, dispatchTasks] = useReducer(reducerTasks, tasksList, initialTasks);
	const [updating, setUpdating] = useState<IUpdating>({ yes: false, value: '', })
	const initSelectedElement = {id: 'null', title: 'null', completed: false, datetime: 'null' };
	const [selectedElement, setSelectedElement] = useState<ITask>(initSelectedElement);

	// const [completeds, setCompleteds] = useState([]);

	// const [todos, setTodos] = useState([]);
	// const [state, setState] = useState({error: null, isLoaded: false, items: []})
	// const apiURL='http://localhost:3000/tasks/getList?id=a2JPHbI_7JaVlUcrMepDJ';
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
		// const {data} = await axios.get(getURL);
		// console.log(data);
		// setTasks(data.items);
		// dispatchTodos({type: 'copyTasks', payload: data.items});
		await fetch(getURL)
		.then(result => result.json())
		.then((data) => dispatchTasks({type: 'copyTasks', tasks: data.items}));
    }

	/* отправка tasks */
	const postTask = (title: string) => {

		if (title === '') //alert
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

		// axios.post(postURL, {                      	/////////!!!!
		// 	id: '3333',
		// 	title: 'Freelance Developer',
		// 	completed: true
		// });
		// let user = {									/////////!!!!
		// 			id: '3333',
		// 		title: 'Freelance Developer551115',
		// 		completed: true
		//   };
		//   let response = await fetch(postURL, {
		// 	method: 'POST',
		// 	headers: {
		// 	  'Content-Type': 'application/json;charset=utf-8'
		// 	},
		// 	body: JSON.stringify(user)
		//   });
		// //   let result = await response.json();
		// //   alert(result.message);
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

		// axios({
		// 	method: 'delete',
		// 	url: deleteURL,
		// 	// data: "vyBb2MbMyPdvoIVWPcxRQ, NshW1AVLsCLekRSSxZgre, KjlYUYqibfk3XNim-2-pU"
		// 	data: ['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU']
		// 	// data: JSON.stringify(['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU'])
		//   });
	}
	



	const addTask = async (title: string) => {

		if (title === "")
		{
			// setStatus({show: true, value: "Field is empty...", error: true});
			return ;
		}
		if (updating.yes === true) {
			// alert(title);
			// alert(selectedElement.title)

			// deleteTask(selectedElement.id);
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
			// getTasks();


			setUpdating( {yes: false, value: ''});
			setSelectedElement(initSelectedElement);
			getTasks();

			return ;
		}

		postTask(title);

	// fetch(getURL)
	// .then(response => response.json())
	// .then(json => console.log('fffff', json))
	// 	instance.post('/tasks/create', {
	// 		id: '3333',
	// 		title: 'Freelance Developer',
	// 		completed: true
	// 	});
		getTasks();
		// deleteTask('-RDbvAYy95BG5gufPvL-T')
		// deleteCompletedTasks();
	}

		// console.log('todos' + todos);

	const updateTask = (task: ITask) => {

		if (task.id === selectedElement.id && updating.yes === true) {
			setUpdating({yes: false, value: ''});
			setSelectedElement(initSelectedElement);
			// alert(updating.yes);
			getTasks();

		} else if (task.id === selectedElement.id && updating.yes === true) {
			getTasks();

			return ;
		} else {
			// alert(updating.yes);

			// deleteTask(task.id);
			// axios({
			// 	method: 'post',
			// 	url: postURL,
			// 	data: {
			// 		id: task.id,
			// 		title: task.title,
			// 		completed: task.completed,
			// 		datetime: task.datetime
			// 	}
			// });
			getTasks();
			setUpdating( {yes: true, value: ''});
			setSelectedElement(task);
		}
	}

	const checkAsComplete = (task: ITask) => {
		if (!updating.yes) {

		// dispatchTasks({type: 'setCompleted', id: id})
		// alert(id);
		// deleteTask(task.id);
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
		// updateTask(task);
		// getTasks();
		}

		getTasks();

	}

	/* подсчет элементов: true === выполенные, false === невыполенные */
	const countElements = (request: boolean) => {
		return tasks.reduce((sum: number, elem: ITask) => (elem.completed === request) ? sum+1 : sum, 0);
	}

	// const resetUpdating = () => {
	// 	setUpdating({yes: false, value: ''});
	// }

	
	return (
		<div className="App">

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




