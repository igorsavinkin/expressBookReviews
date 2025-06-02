const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function filterBooksByISBN(booksObj, targetISBN) {
    return Object.values(booksObj).filter(book => book.isbn === targetISBN);
  }
function filterBooksByAuthor(booksObj, targetAuthor) {
    return Object.values(booksObj).filter(book => book.author === targetAuthor);
  }
function filterBooksByTitle(booksObj, targetTitle) {
    return Object.values(booksObj).filter(book => book.title === targetTitle);
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.set('Content-Type', 'application/json');
  return res.send(JSON.stringify({books}, null, 4));
});*/

public_users.get('/',function (req, res) {
	let myPromise = new Promise((resolve,reject) => {   
		res.set('Content-Type', 'application/json');
		res.send(JSON.stringify({books}, null, 4));
	})
	.then(() => { 
	    console.log("Books are loaded."); 
	})
	.catch((err)=> { res.status(400).send("An error in getting books: "+ err) });	 
});

// Get book details based on ISBN thru Promise
public_users.get('/isbn/:isbn',function (req, res) {
	let myPromise = new Promise((resolve,reject) => {   
		let filteredBooks = filterBooksByISBN(books, req.params.isbn);
		if (filteredBooks.length > 0 ) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({filteredBooks}, null, 4));
		} else {
			res.send("No books in store for isbn: " + req.params.isbn )
		}
	})
	.then(() => { 
	    console.log("Books are loaded."); 
	})
	.catch((err)=> { res.status(400).send("An error in getting books: "+ err) });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	let myPromise = new Promise((resolve,reject) => {   
		let filteredBooks = filterBooksByAuthor(books, req.params.author);
		if (filteredBooks.length > 0 ) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({filteredBooks}, null, 4));
		} else {
			res.send("No books in store for the author: " + req.params.author )
		}
	})
	.then(() => { 
	    console.log("Books are loaded."); 
	})
	.catch((err)=> { res.status(400).send("An error in getting books: "+ err) });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {  
	let myPromise = new Promise((resolve,reject) => {   
		let filteredBooks = filterBooksByTitle(books, req.params.title);
		if (filteredBooks.length > 0 ) {
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify({filteredBooks}, null, 4));
		} else {
			res.send("No books in store with the title: " + req.params.title )
		}
	})
	.then(() => { 
	    console.log("Books are loaded."); 
	})
	.catch((err)=> { res.status(400).send("An error in getting books: "+ err) });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let filteredBooks = filterBooksByISBN(books, req.params.isbn);
    if (filteredBooks.length > 0 ) {
        res.send(filteredBooks[0].reviews);  
      //return res.send(JSON.stringify(filteredBooks.filteredBooks[0].reviews, null, 4));
    } else {
      return res.send("No books in store for isbn: " + req.params.isbn )
    }
});

module.exports.general = public_users; 
