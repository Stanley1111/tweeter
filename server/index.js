"use strict";

// Basic express setup:
require('dotenv').config();
const PORT          = process.env.PORT || 8080;
const http          = require('http');
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient   = require("mongodb").MongoClient;
const MONGODB_URI   = "mongodb://localhost:27017/tweeter";
//"mongodb://localhost:27017/tweeter"
//`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_PORT}/${process.env.DB_NAME}`

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect to MongoServer`);
    throw err;
  }
  
  // The in-memory database of tweets. It's a basic object with an array in it.
  //const db = require("./lib/in-memory-db");

  // The `data-helpers` module provides an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).
  //
  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });

  setInterval(function(){ console.log("Dropping table"); db.collection("tweets").drop(); }, 86400000);
  // The code below here is to make sure that we close the conncetion to mongo when this node process terminates
  function gracefulShutdown() {
    console.log("\nShutting down gracefully...");
    try {
      db.close();
    }
    catch (err) {
      throw err;
    }
    finally {
      console.log("I'll be back.");
      process.exit();
    }
  }
  process.on('SIGTERM', gracefulShutdown); // listen for TERM signal .e.g. kill
  process.on('SIGINT', gracefulShutdown); // listen for INT signal e.g. Ctrl-C

});