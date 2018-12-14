/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  //helper function: validate tweet submission
  function validateTweet (tweet){

    const limit = 140;
    const tlength = tweet.length;
    if(tlength > 140){
      $(".error").empty();
      $(".error").append("Tweet too long");
      $(".error").slideDown("normal", function(){
      });
      return false;
    } else if (tlength < 1){
      $(".error").empty();
      $(".error").append("Enter a tweet");
      $(".error").slideDown("normal", function(){
      });
      return false;
    } else {

      $(".error").slideUp("normal", function(){
        $(".error").empty();
      });
      return true;
    }
  }

  //Helper function: escape text
  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  //Accepts tweet object and returns a JQuery object of the tweet HTML model
  function createTweetElement (data){
    let tweetObj = `

        <article class="old-tweets">
          <header>
            <img src= ${data.user.avatars.small} />
            <span class="name">${escape(data.user.name)}</span>
            <span class="tag">${escape(data.user.handle)}</span>
          </header>
          <div class="twbody">${escape(data.content.text)}</div>
          <footer>
            <span>${moment(data.created_at).fromNow()}</span>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </footer>
        </article>
      `;
    return $(tweetObj);
  }

  //accepts an array of tweet objects and appends to the homepage.
  function renderTweets(tweets){
    $('.container .old').empty();

    for(var i = 0; i < tweets.length; i++){
      var $tweet = createTweetElement(tweets[i]);
      $('.container .old').prepend($tweet);
    }
  }

  //Login
  var $login = $('#login-btn');
  $login.on("click", function() {
    event.preventDefault();
    //console.log("ajax login");
    $.ajax("/tweets/login", { method: "POST", data: $("#login").serialize() })
    .then(function(item){

    });
    //console.log($("#login").serialize());
  });

  //Setup for listening for tweet submission and entry to DB.
  var $submit = $('.new-tweet input');
  $submit.on('click', function () {
    event.preventDefault();
    var tweet = $(this).siblings("textarea")[0].value;

    if (validateTweet(tweet)){
      $.ajax('/tweets', { method: 'POST', data: $(this).siblings("textarea").serialize() })
      .then(function(item){
        loadTweets();
        $(".new-tweet textarea").val('');

        //refresh char counter
        let currLength = $(".new-tweet textarea").val().length;
        let remainingChar = 140 - currLength;
        $(".counter").text(remainingChar);
      })
    }

  });


  //grabs tweets from tweets DB and renders to page.
  function loadTweets(){
    $.ajax('/tweets', { method: 'GET' })
    .then(function (moreTweets){
      //console.log('Success get: ', moreTweets);
      renderTweets(moreTweets);
    })
  }

  loadTweets();

  //toggles the new tweet section from hidden and showing
  $compose = $("#compose");
  $compose.on('click', function(){
    $(".container .new-tweet").slideToggle("normal", function(){

    });
    $(".new-tweet textarea").focus();
  });

});