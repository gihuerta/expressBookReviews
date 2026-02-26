 const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    
    new Promise((resolve,reject) => {
        resolve(books);
    })
    .then(data => {
        res.send(JSON.stringify(data,null,4));
    })
    .catch(err => {
        res.send({message:"Error retrieving books!"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    new Promise((resolve,reject) => {
        const book = books[isbn];

        if (book) {
            resolve(book);
        } else {
            reject({message: "Unable to find book!"});
        }
    })
    .then(book => {
        res.send(book);
    })
    .catch(err => {
        res.send(err);
    });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;
    new Promise((resolve,reject) => {
        const filtered_books = Object.values(books).filter(
            book => book.author === author
        );

        if (filtered_books.length > 0) {
            resolve(filtered_books);
        } else {
            reject({message:"No books found for this author!"});
        }
    })
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(err => {
        res.send(err);
    });
    
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
    new Promise((resolve,reject) => {
        const book = books[isbn];
    if (book) {
        if (Object.keys(book.reviews).length > 0) {
            resolve(book.reviews);resolve(book.reviews);
        } else {
            reject({message:"This book has no reviews!"});
        }
        
    } else {
        reject({message:"Unable to find book!"});
    }
    })
    .then(reviews => {
        res.send(JSON.stringify(reviews));
    })
    .catch(err => {
        res.send(err);
    });
});

module.exports.general = public_users;
