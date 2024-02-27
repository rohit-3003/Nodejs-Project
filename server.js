const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Todo Data (In-Memory)
let todos = [];

// Routes
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], text, completed };
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !== parseInt(id));
    res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
