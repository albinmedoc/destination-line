var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    $("#top-users").show();
  } else {
    $("#top-users").hide();
  }
  prevScrollpos = currentScrollPos;
}