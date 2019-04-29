$(document).ready(function(){
    //-- Tidslinje dragbar --

    var dragging = false, last_position_x, last_position_y, position_x, position_y;

    $(".timeline_container").mousedown(function(e){
        //Användaren trycker ner musen när den är över tidslinjen
        dragging = true;
        last_position_x = e.clientX + $(".timeline_container").scrollLeft();
        last_position_y = e.clientY + $(".timeline_container").scrollTop();
    });

    $(window).mouseup(function(){
        //Användaren släpper musen
        dragging = false;
    });

    $(window).mousemove(function(e){
        if(dragging){
            //Användaren drar i tidslinjen
            position_x = e.clientX + $(".timeline_container").scrollLeft();
            position_y = e.clientY + $(".timeline_container").scrollTop();
            $(".timeline_container").scrollLeft($(".timeline_container").scrollLeft() - (position_x - last_position_x));
            $(".timeline_container").scrollTop($(".timeline_container").scrollTop() - (position_y - last_position_y));
            //Sätter jag "lastPosition = position;" blir det laggigt att dra tidslinjen
            last_position_x = e.clientX + $(".timeline_container").scrollLeft();
            last_position_y = e.clientY + $(".timeline_container").scrollTop();
        }
    });
});