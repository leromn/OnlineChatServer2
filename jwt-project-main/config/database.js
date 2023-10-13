const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI =
  "mongodb+srv://esru3:yonn@cluster0.sbh1vyc.mongodb.net/?retryWrites=true&w=majority";

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
