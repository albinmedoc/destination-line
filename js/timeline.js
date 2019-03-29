$(document).ready(function(){
    //lastposition och position ökar med 70 eftersom den är 70 px ifrån toppen av sidan
    var dragging = false, lastPosition, position;
    $(".timeline").on("mousedown mouseup mousemove", function(e){
        if(e.type == "mousedown"){
            dragging = true;
            lastPosition = e.clientY + $(".timeline").scrollTop() + 70;
        }
        if(e.type == "mouseup"){
            dragging = false;
        }
        if(e.type == "mousemove" && dragging == true){
            position = e.clientY + $(".timeline").scrollTop() + 70;
            $(".timeline").scrollTop($(".timeline").scrollTop() - (position - lastPosition));
            lastPosition = e.clientY + $(".timeline").scrollTop() + 70;
        }
    });
    $(window).on("mouseup", function(){
        dragging = false;
    });
});