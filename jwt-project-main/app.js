require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require('mongoose')

// const User = require("./model/user");
const User = require("./model/collectionModel").User;
const Message = require("./model/collectionModel").Message;
const messageSchema=require('./model/collectionModel').messageSchema;


const auth = require("./middleware/auth");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { fullName, userName, email, password } = req.body;

    // Validate user input
    if (!(email && password && fullName && userName)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ userName });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      fullName,
      userName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      token:'',
      contacts:[{}]
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      "esraelCrypt",
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { userName, password } = req.body;

    // Validate user input
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ userName });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, userName },
        "esraelCrypt",
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.post("/sendMessage", async (req, res) => {

  const{sender,reciever,message}=req.body;

  const user1=await User.findOne({userName:sender});

  var customeTableName=sender+reciever;
  var contactExists=false;
  var tempTableName='';
  // iterate through the contacts array in the object to see 
  // if the reciever is alrweady registered and has created table
  if(user1){
    user1.contacts.forEach(function (contact){
      if(contact.userName==reciever){
        //contact already exists
        contactExists=true;
        console.log("contact exists")
        tempTableName=contact.chatListTable;


      }
    })
  }
  else{
  res.status(200).send("user not found message not sent ");
  }

  if(!contactExists){
    
      User.updateOne({userName:req.body.sender},
      { $push: {"contacts": {
      "userName":req.body.reciever,
      "chatListTable":customeTableName
      }}
  }).then(()=>{console.log("updated one ")})

    User.updateOne({userName:req.body.reciever},
    { $push: {"contacts": {
    "userName":req.body.sender,
    "chatListTable":customeTableName
    }}
  }).then(()=>{console.log("updated two ")});

  }else{
    //if the contact exists
    customeTableName=tempTableName;
    console.log("contct exist: changed the table referece to the fetched")
  }

  const NewMessage=mongoose.model(customeTableName,messageSchema);
  const newMessage=await NewMessage.create({
      sender,
      reciever,
      message
    });


  res.status(200).send("message sent successfully");
});

app.get("/getMessages", async (req, res) => {

  const NewMessage=mongoose.model(req.body.customTableName,messageSchema);
  NewMessage.find().then((result)=>{
    res.json(result);
  }).catch((err)=>console.log(err));

  
  
});

app.post("/addContact", async (req, res) => {

  const{myUserName,reciever}=req.body;

  const user1=await User.findOne({userName:myUserName});

  var customeTableName=myUserName+reciever;
  var contactExists=false;
  var tempTableName='';
  // iterate through the contacts array in the object to see 
  // if the reciever is alrweady registered and has created table
  if(user1){
    user1.contacts.forEach(function (contact){
      if(contact.userName==reciever){
        //contact already exists
        contactExists=true;       
      }
    })
  }
  else{
  res.status(200).send("user not found message not sent ");
  }

  if(!contactExists){
    
      User.updateOne({userName:req.body.myUserName},
      { $push: {"contacts": {
      "userName":req.body.reciever,
      "chatListTable":customeTableName
      }}
  }).then(()=>{console.log("updated one ")})

    User.updateOne({userName:req.body.reciever},
    { $push: {"contacts": {
    "userName":req.body.myUserName,
    "chatListTable":customeTableName
    }}
  }).then(()=>{
    console.log("updated two ");
    res.status(200).send("contact added successfully");
  });

  }else{
    res.json("contact already exists")
  }

  });

app.get("/getContacts", auth, (req, res) => {
  User.find({userName:req.body.myUserName}).then((res)=>{
    res.status(200).json(res.contacts);
  })
  
});


// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
