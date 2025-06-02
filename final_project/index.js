const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const isValid = require('./router/auth_users.js').isValid;
let users = require('./router/auth_users.js').users;
const genl_routes = require('./router/general.js').general;


// Check if a user with the given username already exists
/*const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}*/

// Check if the user with the given username and password exists
/*const authenticatedUser = (username, password) => {
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
}*/

const app = express();

app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))



app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) { // Get the authorization object stored in the session
        token = req.session.authorization['accessToken']; // Retrieve the token from authorization object
        jwt.verify(token, "access", (err, user) => { // Use JWT to verify token
          if (!err) {
            req.user = user;
            next();
          } else {
            return res.status(403).json({ message: "User not authenticated" });
          }
        });
      } else {
        return res.status(403).json({ message: "User not logged in" });
      }
});

// Register a new user
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user.\nif Please check if username or password is missing"});
});


const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
