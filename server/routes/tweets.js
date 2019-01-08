"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  //GET login page
  tweetsRoutes.post("/login", function(req, res){
    console.log("ajax sent:",req.body.uname, req.body.psw);
    const user = {
      username: req.body.uname,
      password: req.body.psw
    };

    DataHelpers.checkUser(user, (err) => {
      if (err) {
        console.log("checkuser error");
        res.status(500).json({ error: err.message });
      } else {
        console.log("checkUser pass");
        //res.status(201).send();
      }
    });
    //res.send();
  });

  //Save a tweet
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;

}
