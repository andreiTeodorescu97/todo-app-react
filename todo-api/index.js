const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Dummy users
const users = [
    { id: '1', username: 'alice', password: 'password1' },
    { id: '2', username: 'bob', password: 'password2' },
];

// In-memory storage
let tokens = {}; // token: userId
let todos = [];
let categories = [
    { id: 'cat1', name: 'Work', dateAdded: new Date().toISOString() },
    { id: 'cat2', name: 'Personal', dateAdded: new Date().toISOString() },
];
let companies = [];

// Middleware to check auth
function authenticate(req, res, next)
{
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.replace('Bearer ', '');
    const userId = tokens[token];
    if (!userId) return res.status(401).json({ error: 'Invalid token' });
    req.userId = userId;
    next();
}

// Dummy login
app.post('/login', (req, res) =>
{
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = uuidv4();
    tokens[token] = user.id;
    res.json({ token });
});

// Dummy logout
app.post('/logout', authenticate, (req, res) =>
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.replace('Bearer ', '');
    delete tokens[token];
    res.json({ message: 'Logged out' });
});

// Get todos for logged-in user
app.get('/todos', authenticate, (req, res) =>
{
    const userTodos = todos.filter(todo => todo.userId === req.userId);
    res.json(userTodos);
});

// Patch to update a todo (name, description, categoryId, completed)
app.patch('/todos/:id', authenticate, (req, res) =>
{
    const todo = todos.find(t => t.id === req.params.id && t.userId === req.userId);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    const { name, description, categoryId, completed } = req.body;
    if (name !== undefined) todo.name = name;
    if (description !== undefined) todo.description = description;
    if (categoryId !== undefined) todo.categoryId = categoryId;
    if (completed !== undefined)
    {
        todo.completed = completed;
        todo.dateCompleted = completed ? new Date().toISOString() : null;
    }
    res.json(todo);
});

// Delete uncompleted todo
app.delete('/todos/:id', authenticate, (req, res) =>
{
    const idx = todos.findIndex(t => t.id === req.params.id && t.userId === req.userId);
    if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
    if (todos[idx].completed) return res.status(400).json({ error: 'Cannot delete completed todo' });
    todos.splice(idx, 1);
    res.json({ id: req.params.id, message: 'Todo deleted' });
});

// (Optional) Add a todo for testing
app.post('/todos', authenticate, (req, res) =>
{
    const { name, description, categoryId } = req.body;
    const todo = {
        id: uuidv4(),
        userId: req.userId,
        categoryId,
        name,
        description,
        dateAdded: new Date().toISOString(),
        completed: false,
        dateCompleted: null,
    };
    todos.push(todo);
    res.status(201).json(todo);
});

// (Optional) Get categories
app.get('/categories', authenticate, (req, res) =>
{
    res.json(categories);
});

// Add a new category
app.post('/categories', (req, res) =>
{
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const category = { id: uuidv4(), name, dateAdded: new Date().toISOString() };
    categories.push(category);
    res.status(201).json(category);
});

// Delete a category by id
app.delete('/categories/:id', (req, res) =>
{
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    categories.splice(idx, 1);
    res.json({ id: req.params.id, message: 'Category deleted' });
});

// Add a PATCH endpoint to update a category by id
app.patch('/categories/:id', (req, res) =>
{
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });
    const { name } = req.body;
    if (name !== undefined) categories[idx].name = name;
    res.json(categories[idx]);
});

app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
}); 