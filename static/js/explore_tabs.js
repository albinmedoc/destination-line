var prevScrollpos = window.pageYOffset;

// diffrence < 0 = ner, diffrence > 0 = upp
var difference = 0;

window.onscroll = function(){
    var currentScrollPos = window.pageYOffset;
    difference = difference + (prevScrollpos-currentScrollPos);
    //Användaren skrollar nedåt
    if (prevScrollpos > currentScrollPos) {
        if(difference <= -200){
            difference = 0;
        }
        if(difference >= 200){
            $("body > nav").addClass("is_visible");
            $("#explore_tabs").addClass("is_visible");
        }
    }
    //Användaren skrollar uppåt
    else {
        if(difference >= 200){
            difference = 0;
        }
        if(difference <= -200){
            $("body > nav").removeClass("is_visible");
            $("#explore_tabs").removeClass("is_visible");
        }
    }
    prevScrollpos = currentScrollPos;
}

window.onload = function(){
    $("#explore_tabs > .explore_tab").click(function(){
        //Klickar på following
        if($(this).hasClass("following")){
            //Visar following-sektion och döljer explore-sektion
            $("#explore").hide();
            $("#following").show();
            $("#explore_tabs > .explore_tab.following, #following").addClass("active");
            $("#explore_tabs > .explore_tab.explore, #explore").removeClass("active");
        }
        //Klickar på explore
        else{
            //Visar explore-sektion och döljer following-sektion
            $("#following").hide();
            $("#explore").show();
            $("#explore_tabs > .explore_tab.explore, #explore").addClass("active");
            $("#explore_tabs > .explore_tab.following, #following").removeClass("active");
        }
        //Scrollar till toppen
        $("html, body").animate({ scrollTop: 0 }, "fast");
        //Visar både nav och explore_tabs
        $("body > nav").addClass("is_visible");
        $("#explore_tabs").addClass("is_visible");
    });
}