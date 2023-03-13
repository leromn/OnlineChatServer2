const express = require("express");

const mongoose=require('mongoose');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());

let Models=require('./jwt-project-main/model/collectionModel');

const PORT = process.env.PORT || 3000;
const User=Models.User;



// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));


app.get("/", (request, response) => {
    response.send("Hi there");
});


app.listen(PORT, () => {
    console.log("Listen on the port 3000...");
});


const uri="mongodb+srv://esru2:Yonn4321@cluster0.sbh1vyc.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true});
const connection=mongoose.connection;

connection.once('open',()=>{
        console.log('connected to database')
   });   
