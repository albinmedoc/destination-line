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

$(document).ready(function(){
  $("#account_container").click(function(){
    $("#login_container, #login").toggleClass("show");
    //$("body, html").css('overflow-y', 'hidden');
  });
  $(".blur_overlay").click(function(){
    $("#login_container, #login").toggleClass("show");
    //$("body, html").css('overflow-y', 'visible');
  });
});