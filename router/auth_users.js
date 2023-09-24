const express = require('express');
const regd_users = express.Router();
const booksArray = require('./booksdb.js');


let users = {
    user1: 'p@ssword123',
};
let books = {};
booksArray.forEach(book => {
    books[book.isbn] = book;
});

const isValid = (username, password) => {
    return users[username] && users[username] === password;
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (isValid(username, password)) {
        req.session.username = username; // Store the username in the session after successful login
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Login failed' });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username; 

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is missing" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: 'Review added/modified successfully', review: review });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
