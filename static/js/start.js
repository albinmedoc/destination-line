$(document).ready(function(){
    $(".album > .info_circle").click(function(){
        var album_link = $(this).siblings(".album_link").attr("href");
        if(album_link){
            window.location = album_link;
        }
    });
});