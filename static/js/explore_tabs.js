var prevScrollpos = window.pageYOffset;

// diffrence < 0 = ner, diffrence > 0 = upp
var diffrence = 0;

window.onscroll = function(){
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

window.onload = function(){
    $("#explore_tabs > .explore_tab").click(function(){
        //Klickar på following
        if($(this).hasClass("following")){
            $("#explore").hide();
            $("#following").show();
        }
        //Klickar på explore
        else{
            $("#following").hide();
            $("#explore").show();
        }
        //Bytar plats på active-class
        $("#explore_tabs > .explore_tab").toggleClass("active");
    });
}