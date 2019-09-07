var timeout;
$('#search').keyup(function () {
    //Gör en sökning en halv sekund efter användaren har skrivit (detta eftersom vi vill undvika för många requests)
    if (timeout || $(this).val() == "") {
        clearTimeout(timeout);
        timeout = null;
    }else{
        timeout = setTimeout(do_search, 500)
    }
})

var do_search = function () {
    $("nav .loader_container").addClass("is_visible");
    $("#destinations, #users").children(".search_result").remove();
    //Hämtar sökresultat
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/search/albums",
        data: {
            search: $("#search").val()
        },
        timeout: 35000,
        success: function(albums){
            for (var index in albums) {
                var album = albums[index];
                $("#destinations").append("<div class='search_result'><i class='material-icons-outlined'>place</i><a href='" + $SCRIPT_ROOT + "/album/" + album["id"] + "'><img src='" + $SCRIPT_ROOT + "static/album_img/" + album["preview_img"] + "'></a><div class='destinations_search_info'><a href='" + $SCRIPT_ROOT + "/album/" + album["id"] + "' class='city'><h3>" + album["city"] + "</h3></a><p>" + album["country"] + "</p><a class='album_owner' href='#'><i class='material-icons-outlined'>person</i><span>" + album["firstname"] + " " + album["lastname"] + "</span></a></div></div>");
            }
        },
        complete: function(){
            $("nav .loader_container").removeClass("is_visible");
        }
    });
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/search/users",
        data: {
            search: $("#search").val()
        },
        timeout: 35000,
        success: function(users){
            for (var index in users) {
                var user = users[index];
                var profile_img = $SCRIPT_ROOT + "/static/" + (user.profile_img ? "profile_img/" + user.profile_img : "img/avatar.png");
                $("#users").append("<div class='search_result'><i class='material-icons-outlined'>person</i><div class='search_result_top'><img src='" + profile_img + "'><div class='user_search_info'><h3>" + user["firstname"] + " " + user["lastname"] + "</h3></div></div><a href='" + $SCRIPT_ROOT + "/profile/" + user["username"] + "' class='username'><span>" + user["username"] + "</span></a></div>")
            }
            $("nav .loader_container").removeClass("is_visible");
        }
    });
};

//Döljer och visar sökresultat och sökruta
$("#search_container>a").click(function () {
    if (!$(this).hasClass('is_visible')) {
        $("#search_results, #search, #search_container, #search_container>a").addClass("is_visible");
        $("#search").focus();
        //Ändrar ikon till kryss och text till "Cancel"
        $("#search_container>a>i").html("close");
        $("#search_container>a>span").html("Cancel");
    } else if ($(this).hasClass('is_visible')) {
        $("#search_results, #search, #search_container, #search_container>a").removeClass("is_visible");
        //Ändrar ikon till sök-ikon och text till "Search"
        $("#search_container>a>i").html("search");
        $("#search_container>a>span").html("Search");
    }
});