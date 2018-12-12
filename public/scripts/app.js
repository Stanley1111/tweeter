/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  // const tweetData = {
  //   "user": {
  //     "name": "Newton",
  //     "avatars": {
  //       "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
  //       "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
  //       "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
  //     },
  //     "handle": "@SirIsaac"
  //   },
  //   "content": {
  //     "text": "If I have seen further it is by standing on the shoulders of giants"
  //   },
  //   "created_at": 1461116232227
  // }

  //Accepts tweet object and returns a JQuery object of the tweet HTML model
  function createTweetElement (data){
    let tweetObj = `

        <article class="old-tweets">
          <header>
            <img src= ${data.user.avatars.small} />
            <span class="name">${data.user.name}</span>
            <span class="tag">${data.user.handle}</span>
          </header>
          <div class="twbody">${data.content.text}</div>
          <footer>
            <span>x days ago</span>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </footer>
        </article>
      `;
    return $(tweetObj);
  }



  // var $tweet = createTweetElement(tweetData);

  // // Test / driver code (temporary)
  // console.log($tweet); // to see what it looks like
  // $('.container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
  // Fake data taken from tweets.json
  // const data = [
  //   {
  //     "user": {
  //       "name": "Newton",
  //       "avatars": {
  //         "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
  //         "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
  //         "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
  //       },
  //       "handle": "@SirIsaac"
  //     },
  //     "content": {
  //       "text": "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     "created_at": 1461116232227
  //   },
  //   {
  //     "user": {
  //       "name": "Descartes",
  //       "avatars": {
  //         "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
  //         "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
  //         "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
  //       },
  //       "handle": "@rd" },
  //     "content": {
  //       "text": "Je pense , donc je suis"
  //     },
  //     "created_at": 1461113959088
  //   },
  //   {
  //     "user": {
  //       "name": "Johann von Goethe",
  //       "avatars": {
  //         "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
  //         "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
  //         "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
  //       },
  //       "handle": "@johann49"
  //     },
  //     "content": {
  //       "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
  //     },
  //     "created_at": 1461113796368
  //   }
  // ];

  //accepts an array of tweet objects and appends to the homepage.
  function renderTweets(tweets){
    for(var i = 0; i < tweets.length; i++){
      var $tweet = createTweetElement(tweets[i]);
      $('.container').append($tweet);
    }


  }

  //Setup for listening for tweet submission and entry to DB.
  var $submit = $('.new-tweet input');
  $submit.on('click', function () {
    event.preventDefault();
    var tweet =$(this).siblings("textarea")[0].value;
    // var l = x.val().length;
    // console.log($(this).siblings("textarea").serialize(), l);

    if (validateTweet(tweet)){
      $.ajax('/tweets', { method: 'POST', data: $(this).siblings("textarea").serialize() })
      .then(function(item){
        console.log("Ajax Post");
      })
    }

  });

  //helper function: validate tweet submission
  function validateTweet (tweet){

    const limit = 140;
    const tlength = tweet.length;
    if(tlength > 140){
      alert("Tweet too long!");
      return false;
    } else if (tlength < 1){
      alert("No tweet found!");
      return false;
    } else {
      return true;
    }
  }

  //grabs tweets for tweets DB and renders to page.
  function loadTweets(){
    $.ajax('/tweets', { method: 'GET' })
    .then(function (moreTweets){
      //console.log('Success get: ', moreTweets);
      renderTweets(moreTweets);
    })
  }

  loadTweets();

});