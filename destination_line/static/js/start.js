var page_explore = 1;
var page_following = 1;
var bottom_explore = false;
var bottom_following = false;

$(document).ready(function () {
    load_albums();
    if($("#following")){
        load_albums(true);
    }

    //Gör album klickbara
    $("#following, #explore").click(".album > .info_circle", function () {
        var album_link = $(this).siblings(".album_link").attr("href");
        if (album_link) {
            window.location = album_link;
        }
    });
});

function load_albums(following_albums = false) {
    var bottom = following_albums ? bottom_following : bottom_explore;
    if(bottom){
        return;
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/load_albums",
        method: "POST",
        data: {
            follow: following_albums,
            page: following_albums ? page_following : page_explore
        },
        success: function (albums) {
            if (albums.length) {
                for (var index in albums) {
                    var album = albums[index];
                    $(following_albums ? "#following" : "#explore").append("<div class='album'><a class='album_link' href='" + $SCRIPT_ROOT + "/album/" + album["id"] + "'></a><img src='" + $SCRIPT_ROOT + "/static/album_img/" + album["preview_img"] + "' alt='" + album["country"] + " - " + album["city"] + "'><div class='info_circle'><h1 class='city'>" + album["city"] + "</h1><h2 class='country'>" + album["country"] + "</h2><i class='material-icons-outlined'>camera_alt</i><a href='" + $SCRIPT_ROOT + "/profile/" + album["username"] + "' class='author'>" + album["firstname"] + " " + album["lastname"] + "</a></div></div>");
                }
            }else{
                if(following_albums){
                    bottom_following = true;
                }else{
                    bottom_explore = true;
                }
            }
        }
    });
    if(following_albums){
        page_following++;
    }else{
        page_explore++;
    }
}

// Each time the user scrolls
$(window).scroll(function () {
    // End of the document reached?
    if ($(document).height() - $(window).height() == $(window).scrollTop()) {
        // Load new albums
        load_albums($("#following").hasClass("active"));
    }
});