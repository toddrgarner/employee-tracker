// ************* Reference Variables ************* //
const express = require('express');
const Directory = require("./lib/index.js");

// const path = require('./routes');

// Initializing my server - Calling express from the library and setting it equal to the variable called "app"
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This fucntion allow me to request and links my static access such as; images.jpg, java scrift 
// file or style.css sheet from the public folder I create.
app.use(express.static("public")) 

// Routes
// ==============================================================

// Basic route tha sends the user first toi the AJAX of Fetch.
// app.get("/", function(req, res) {
//     res.sendFile(path.join(_dirname, "public/add.html"));    
// });
    
// app.get("/add", function(req,res){
// res.sendFile(path.join(_dirname, "public/add.html"));
// });


// turn on routes  
app.use(routes);

// (app.listen)This function spins up the server run on the the "PORT". The second part let's you know that it's up and running.
app.listen(PORT, () => console.log('Now Listening'));