// alert("composer-char-counter connected!");

$(document).ready(function() {
  // --- our code goes here ---

  $(".new-tweet form textarea").on('keyup', function(){
    let currLength = $(this).val().length;
    let remainingChar = 140 - currLength;

    let $curCount = $(this).siblings(".counter");
    $curCount.text(remainingChar);

    if (remainingChar < 0){
      $curCount.addClass("over");
    } else if (remainingChar >= 0){
      $curCount.removeClass("over");
    }

  });



});
