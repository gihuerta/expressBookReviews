const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return !users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some((user) =>
        user.username === username && user.password === password
    );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send({message:"User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if(!books[isbn]) {
    res.send({message:"Book not found"});
  } else {
    books[isbn].reviews[username] = review;
    res.send({message:"Review added/updated successfully"});
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!books[isbn]) {
        res.send({message:"Book not found"});
    } else {
        delete books[isbn].reviews[username];
        res.send({message:`${username}'s reviews successfully deleted for ${books[isbn].title}`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
