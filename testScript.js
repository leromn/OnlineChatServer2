const express = require("express");
const app = express();
const mongoose=require('mongoose');
const cors=require('cors')

let Models=require('./jwt-project-main/model/collectionModel');

const PORT = process.env.PORT || 3000;



const User=Models.User;

app.use(cors());
app.use(express.json());
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

  
User.updateOne({userName:"cholele21"},
{ $push: {"contacts": {
    "userName":"sender",
    "chatListTable":"customeTableName"
    }}
}).then(()=>{console.log("updated one ")})
