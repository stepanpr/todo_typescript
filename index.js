const {nanoid} = require('nanoid')
const db = require('dblite')('database')
const express = require('express')
const app = express()

db.query('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, completed BOOLEAN, datetime NUMBER)')

app.use(express.json())

app.get('/tasks/getList', (req, res) => {
    db.query('SELECT id, title, completed, datetime FROM tasks', (err, rows) => {
        if (err) {
            res.status(500).send(err)
        } else {
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

app.delete('/tasks/delete', (req, res) => {
    db.query('DELETE FROM tasks WHERE id IN (?)', [req.body.join(', ')], (err) => {
        if (err) {
            res.status(500).send(err)
        } else {
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

    db.query('INSERT INTO tasks VALUES ($id, $title, $completed, $datetime)', body, (err, rows) => {
        if (err) {
            res.status(400).send(err)
        } else {
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
            res.send(body)
        }
    })
})

app.listen(3000, () => {
    console.log('Сервер запущен.')
})