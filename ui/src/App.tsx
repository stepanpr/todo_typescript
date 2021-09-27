import React, {  useState, useReducer, useEffect } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import './App.css';
import axios from 'axios';
import { ITask } from './interfaces/ITask'

// curl -d '{"id":"value1", "title":"value2", "completed":"true"}' -H "Content-Type: application/json" -X POST http://localhost:3000/tasks/create


function initialTasks() {
	return([
		{ id: '0', title: 'todo1', completed: false, datetime: 222},
		{ id: '1', title: 'todo2', completed: false, datetime: 222},
	])
}



function reducerTasks(state: any, action: any) {
	switch (action.type) {
		case 'addTask': {
			const { title } = action.payload;
			console.log('addTodo state:', state);
			console.log('addTodo:', title);
			return [
				...state, 
				{
					id: 2,
					title: title,
					completed: false,
					datetime: 64
				}
			];
		}
		case 'copyTasks': {
			const tasks  = action.tasks;
			// let newTasks = tasks.slice();
			const newTasks = tasks.map((a : any) => ({...a}));
			// console.log();

			return newTasks;
		}
		default: 
			return state;
	}

}


const App: React.FunctionComponent = () => {


	let tasksList: any = [];
	// const [tasks, setTodos] = useState([]);
	const [tasks, dispatchTasks] = useReducer(reducerTasks, tasksList, initialTasks);

	// const [todos, setTodos] = useState([]);
	// const [state, setState] = useState({error: null, isLoaded: false, items: []})
	// const apiURL='http://localhost:3000/tasks/getList?id=a2JPHbI_7JaVlUcrMepDJ';
	const getURL='http://localhost:3000/tasks/getList';
	const postURL='http://localhost:3000/tasks/create';
	const deleteURL='http://localhost:3000/tasks/delete';

	useEffect( () => {
		fetch(getURL)
		.then(data => data.json())
		.then((data) => dispatchTasks({type: 'copyTasks', tasks: data.items})
		)
	}, [dispatchTasks]);


	/* загрузка tasks */
	const getTasks = async () => {
		// const {data} = await axios.get(getURL);
		// console.log(data);
		// setTasks(data.items);
		// dispatchTodos({type: 'copyTasks', payload: data.items});
		fetch(getURL)
		.then(result => result.json())
		.then((data) => dispatchTasks({type: 'copyTasks', tasks: data.items}));
    }

	const postTask = (title: string) => {

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

	const deleteCompletedTasks = () => {
		axios({
			method: 'delete',
			url: deleteURL,
			// data: "vyBb2MbMyPdvoIVWPcxRQ, NshW1AVLsCLekRSSxZgre, KjlYUYqibfk3XNim-2-pU"

			data: ['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU']
			// data: JSON.stringify(['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU'])

			
		  });
	}
	



	const addTask = async (title: string) => {

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
		deleteTask('-RDbvAYy95BG5gufPvL-T')
		// deleteCompletedTasks();



		// axios({
		// 	method: 'delete',
		// 	url: deleteURL,
		// 	// data: "vyBb2MbMyPdvoIVWPcxRQ, NshW1AVLsCLekRSSxZgre, KjlYUYqibfk3XNim-2-pU"

		// 	// data: ['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU']
		// 	// data: JSON.stringify(['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU'])
		//   });
		// alert(title);
		getTasks();

		// tasks.map(task => console.log('sss', task));
		// console.log(tasks);
		// dispatchTodos({type: 'addTodo', payload: { title }});


		// console.log('addTodo:', title);
		// let { todos } = await axios.post('/tasks/create');
		// axios.post('http://localhost:3000/tasks/getList', { id: 'fff', title: 'todo1', completed: false, datetime: 222})
		//   .then(function (response) {
		// 	console.log(response);
		//   })
		//   .catch(function (error) {
		// 	console.log(error);
		//   });


		// 	axios.get(apiUrl).then((resp) => {
		// const allPersons = resp.data;
		// // setAppState(allPersons);
		// console.log('addTodo1111', allPersons);

		// dispatchTodos({type: 'addTodo', payload: { title }});
	//   });
	}

		// console.log('todos' + todos);

	
	return (
		<div className="App">

			<div className="container">
				<TodoList tasks={tasks} deleteTask={deleteTask}/> 

				<TodoForm addTask={addTask}/>
			</div>

		</div>




	);
}

export default App;



