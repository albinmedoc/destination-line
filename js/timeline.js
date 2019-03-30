$(document).ready(function(){

    //-- Tidslinje dragbar --
    //lastposition och position ökar med 70 eftersom den är 70px ifrån toppen av sidan
    var dragging = false, lastPosition, position;
    $(".timeline").on("mousedown mouseup mousemove", function(e){
        if(e.type == "mousedown"){
            //Användaren trycker ner musen
            dragging = true;
            lastPosition = e.clientY + $(".timeline").scrollTop() + 70;
        }
        if(e.type == "mouseup"){
            //Användaren släppte musen
            dragging = false;
        }
        if(e.type == "mousemove" && dragging == true){
            //Användaren drar i tidslinjen
            position = e.clientY + $(".timeline").scrollTop() + 70;
            $(".timeline").scrollTop($(".timeline").scrollTop() - (position - lastPosition));
            //Sätter jag "lastPosition = position;" blir det laggigt att dra tidslinjen
            lastPosition = e.clientY + $(".timeline").scrollTop() + 70;
        }
    });
    $(window).on("mouseup", function(){
        dragging = false;
    });

    
    // -- Hindra att scrolla hela sidan när man skrollar på tidslinjen --
    var hovering = false;
    $(".timeline").on("mouseover", function(){
        //Användarens mus är ovanför tidslinjen
        hovering = true;
    });

    $(".timeline").off("mouseover", function(){
        //Användarens mus lämnade tidslinjen
        hovering = false;
    });

    $(document).on("scroll", function(){
        //Förhindra att hela sidan skrollas ifall användarens mus är ovanför tidslinjen
        if(hovering){
            return false;
        }
    });
});