const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
//var filterbyISBN = require("./general.js").filterbyISBN;
const regd_users = express.Router();

let users = [];

function filterBooksByISBN(booksObj, targetISBN) {
    return Object.values(booksObj).filter(book => book.isbn === targetISBN);
  }

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Check username or password." });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 600 * 600  }); // 1 hour

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in !!");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or update a book review 
regd_users.put("/auth/review/:isbn", (req, res) => {  
    if (req.session.authorization) {
        let filteredBooks = filterBooksByISBN(books, req.params.isbn);
        let username = req.session.authorization.username;
        if (filteredBooks.length > 0 ) {
            //let allReviews =  filteredBooks[0].reviews; 
            // Updating or adding review from query
            filteredBooks[0].reviews[username] =  req.query.review;
            res.send(`Review "${filteredBooks[0].reviews[username]}" of user "${username}" has been added to the book with ISBN "${req.params.isbn}".` );
        //return res.send(JSON.stringify(filteredBooks.filteredBooks[0].reviews, null, 4));
        } else {
            return res.send("No books in store for isbn: " + req.params.isbn )
        } 
    } 
    res.send("The user is not authorised/not logged in.");
}); 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
