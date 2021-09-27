const {nanoid} = require('nanoid')
const db = require('dblite')('database')
const express = require('express')
const app = express()

db.query('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN, datetime NUMBER)')

app.use(express.json())


// app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "https://localhost:3000");
//     next();
// });
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

app.get('/tasks/getList', (req, res) => {
    db.query('SELECT id, title, completed, datetime FROM tasks', (err, rows) => {
        if (err) {
            res.status(500).send(err)
        } else {
			res.header("Access-Control-Allow-Origin", "*"); //хедер для разрешения доступа
            res.send({
                items: rows.map(([id, title, completed, datetime]) => ({
                    id, 
                    title, 
                    completed: completed === "1", 
                    ...(datetime && {datetime}) 
                }))
            })
        }
    })
})

// db.query("delete from postschema where id = ?", req.params.id, (er, res)=>{
// db.query('DELETE FROM tasks WHERE id IN (?)', [req.body.join(', ')], (err) => {
	// Array.isArray(props.tasks)
	// db.query('DELETE FROM tasks WHERE id = ?', [req.body.id], (err) => {
		// let list = ['vyBb2MbMyPdvoIVWPcxRQ', 'NshW1AVLsCLekRSSxZgre', 'KjlYUYqibfk3XNim-2-pU'];
		// let Query = `DELETE FROM Table WHERE id IN (${list})`;
app.delete('/tasks/delete', (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.body.id], (err) => {
		res.header("Access-Control-Allow-Origin", "*"); //хедер для разрешения доступа
		// console.log(req.body)
        if (err) {
            res.status(500).send(err)
        } else {
			res.header("Access-Control-Allow-Origin", "*"); //хедер для разрешения доступа
            res.sendStatus(200)
        }
    })
})

app.post('/tasks/create', (req, res) => {
    const body = {
        id: nanoid(), 
        title: req.body.title, 
        completed: req.body.completed || false, 
        datetime: Math.floor(Date.now() / 1000)
    }
	
	// res.header("Access-Control-Allow-Origin", "http://localhost:3001"); //хедер для разрешения доступа
	res.header('Access-Control-Allow-Origin', '*');

    db.query('INSERT INTO tasks VALUES ($id, $title, $completed, $datetime)', body, (err, rows) => {
        if (err) {
            res.status(400).send(err)
        } else {
			// res.header("Access-Control-Allow-Origin", "true");
			// Access-Control-Allow-Origin: http://siteA.com
			// res.header("Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS"); //хедер для разрешения доступа

            res.send(body)
        }
    })
})

app.post('/tasks/update', (req, res) => {
    const body = {
        id: req.body.id,
        title: req.body.title,
        completed: req.body.completed || false,
        datetime: req.body.datetime
    }

    db.query('UPDATE tasks SET title = $title, completed = $completed WHERE id = $id', body, (err) => {
        if (err) {
            res.status(400).send(err)
        } else {
			res.header("Access-Control-Allow-Origin", "*"); //хедер для разрешения доступа
            res.send(body)
        }
    })
})

app.listen(3000, () => {
    console.log('Сервер запущен.')
})