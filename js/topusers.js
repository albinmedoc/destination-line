var prevScrollpos = window.pageYOffset;

// diffrence < 0 = down, diffrence > 0 = up
var diffrence = 0;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  diffrence = diffrence + (prevScrollpos-currentScrollPos);
  if (prevScrollpos > currentScrollPos) {
      if(diffrence <= -200){
          diffrence = 0;
      }
      if(diffrence >= 200){
          $("#top-users").addClass("isVisible");
      }
  } else {
    if(diffrence >= 200){
        diffrence = 0;
    }
    if(diffrence <= -200){
        $("#top-users").removeClass("isVisible");
    }
  }
  prevScrollpos = currentScrollPos;
}