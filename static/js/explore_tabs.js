var prevScrollpos = window.pageYOffset;

// diffrence < 0 = ner, diffrence > 0 = upp
var diffrence = 0;

window.onscroll = function(){
    var currentScrollPos = window.pageYOffset;
    diffrence = diffrence + (prevScrollpos-currentScrollPos);
    //Användaren skrollar nedåt
    if (prevScrollpos > currentScrollPos) {
        if(diffrence <= -200){
            diffrence = 0;
        }
        if(diffrence >= 200){
            $("body > nav").addClass("is_visible");
            $("#explore_tabs").addClass("is_visible");
        }
    }
    //Användaren skrollar uppåt
    else {
        if(diffrence >= 200){
            diffrence = 0;
        }
        if(diffrence <= -200){
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
        }
        //Klickar på explore
        else{
            //Visar explore-sektion och döljer following-sektion
            $("#following").hide();
            $("#explore").show();
        }
        //Bytar plats på active-class
        $("#explore_tabs > .explore_tab").toggleClass("active");
        //Scrollar till toppen
        $("html, body").animate({ scrollTop: 0 }, "fast");
        //Visar både nav och explore_tabs
        $("body > nav").addClass("is_visible");
        $("#explore_tabs").addClass("is_visible");
    });
}