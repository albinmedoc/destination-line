var prevScrollpos = window.pageYOffset;

// diffrence < 0 = ner, diffrence > 0 = upp
var diffrence = 0;

window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    diffrence = diffrence + (prevScrollpos-currentScrollPos);
    if (prevScrollpos > currentScrollPos) {
        if(diffrence <= -200){
            diffrence = 0;
        }
        if(diffrence >= 200){
            $("nav").addClass("is_visible");
            $("#explore_tabs").addClass("is_visible");
        }
    } else {
        if(diffrence >= 200){
            diffrence = 0;
        }
        if(diffrence <= -200){
            $("nav").removeClass("is_visible");
            $("#explore_tabs").removeClass("is_visible");
        }
    }
    prevScrollpos = currentScrollPos;
}