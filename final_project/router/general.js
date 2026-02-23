const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send("Need username and password");
    }
    
    if (users.find(user => user.username === username)) {
      return res.send("Username already exists!");
    }

    users.push({
      username: username,
      password: password,
    });
  
    res.send(`User ${username} has been added`);
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);

  } else {
    res.send("Unable to find book!");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filtered_books = Object.values(books).filter(
        book => book.author === author
      );
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filtered_books = Object.values(books).filter(
        book => book.title === title
      );
    res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.send(book.review);
    } else {
        res.send("Unable to find book!");
    }
});

module.exports.general = public_users;
