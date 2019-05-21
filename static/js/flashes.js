$(document).ready(function(){
    //Flytar ned navigationen ifall flashes skall visas
    offset_nav();

    //Användaren vill stänga ned flashen
    $("#flashes > .flash > .close").click(function(){
        //Tar bort den valde flashen
        $(this).parent().remove();
        //Flyttar upp navigationen ifall def behövs
        offset_nav();
    });

    //Körs 5 sekunder efter sidan har laddats in
    setTimeout(function(){
        //Ta bort alla flashes
        $('#flashes').remove();
        //Flytta upp navigationen
        offset_nav();
    }, 5000);
});

function offset_nav(){
    //Räknar ut hur mycket navigationen och explore_tabs behövs flyttas ned
    var offset = count_flashes() * 60;
    //Flyttar navigationen
    $("nav").css({
        "margin-top": offset + "px"
    });
    //Flyttar explore_tabs
    $("#explore_tabs").css({
        "margin-top": offset + "px"
    });
}

//Retunerar antal flashes som skal visas
function count_flashes(){
    //Kontrollera ifall det finns några flashes
    if($("#flashes").length){
        //Räknar hur många flashes det finns
        return $("#flashes").children().length;
    }
    return 0;
}