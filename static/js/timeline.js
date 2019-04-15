$(document).ready(function(){
    //-- Tidslinje dragbar --

    var dragging = false, lastPositionX, lastPositionY, positionX, positionY;

    $(".timeline_container").mousedown(function(e){
        //Användaren trycker ner musen när den är över tidslinjen
        dragging = true;
        lastPositionX = e.clientX + $(".timeline_container").scrollLeft();
        lastPositionY = e.clientY + $(".timeline_container").scrollTop();
    });

    $(window).mouseup(function(){
        //Användaren släpper musen
        dragging = false;
    });

    $(window).mousemove(function(e){
        if(dragging){
            //Användaren drar i tidslinjen
            positionX = e.clientX + $(".timeline_container").scrollLeft();
            positionY = e.clientY + $(".timeline_container").scrollTop();
            $(".timeline_container").scrollLeft($(".timeline_container").scrollLeft() - (positionX - lastPositionX));
            $(".timeline_container").scrollTop($(".timeline_container").scrollTop() - (positionY - lastPositionY));
            //Sätter jag "lastPosition = position;" blir det laggigt att dra tidslinjen
            lastPositionX = e.clientX + $(".timeline_container").scrollLeft();
            lastPositionY = e.clientY + $(".timeline_container").scrollTop();
        }
    });
});