const express = require('express');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');
const axios = require('axios'); // Import Axios

const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (users[username]) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users[username] = password;
    return res.status(201).json({ message: 'User registered successfully' });
});

public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/'); // Local endpoint to get all books
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

public_users.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (isValid(username, password)) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Login failed' });
    }
});

public_users.post('/review/:isbn', (req, res) => {
    const { username, review } = req.body;
    const isbn = req.params.isbn;
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: 'Review added/modified successfully' });
});

public_users.delete('/review/:isbn', (req, res) => {
    const { username } = req.body;
    const isbn = req.params.isbn;
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Review not found' });
    }
});

public_users.get('/books-async-await', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/booksdb`); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books.' });
    }
});

public_users.get('/books/:isbn', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/books/${req.params.isbn}`); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error getting book details' });
    }
});

public_users.get('/author/:authorName', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.authorName}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books by author' });
    }
});

public_users.get('/title/:bookTitle', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.bookTitle}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error getting books by title' });
    }
});

module.exports.general = public_users;
