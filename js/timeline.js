$(document).ready(function(){
    //-- Tidslinje dragbar --
    //lastposition och position ökar med 70 eftersom den är 70px ifrån toppen av sidan

    var dragging = false, lastPosition, position;

    $(".timeline_container").mousedown(function(e){
        //Användaren trycker ner musen när den är över tidslinjen
        dragging = true;
        lastPosition = e.clientY + $(".timeline_container").scrollTop() + 70;
    });

    $(window).mouseup(function(){
        //Användaren släpper musen
        dragging = false;
    });

    $(window).mousemove(function(e){
        if(dragging){
            //Användaren drar i tidslinjen
            position = e.clientY + $(".timeline_container").scrollTop() + 70;
            $(".timeline_container").scrollTop($(".timeline_container").scrollTop() - (position - lastPosition));
            //Sätter jag "lastPosition = position;" blir det laggigt att dra tidslinjen
            lastPosition = e.clientY + $(".timeline_container").scrollTop() + 70;
        }
    });
});