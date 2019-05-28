//Kontrollerar om username redan finns
var timeout;
$('#search').keyup(function () {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    timeout = setTimeout(do_search, 500)
})
var do_search = function () {
    $("nav .loader_container").addClass("is_visible");
    $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request/search",
            data: {
                search: $("#search").val()
            },
            timeout: 35000
        })
        .done(function (data) {
            $(".search_category").html('');
            if (data.destinations) {
                for (destination in data.destinations) {
                    $("#destinations").append("<div class='search_result'><i class='material-icons-outlined'>place</i><a href='/album/" + data.destinations[destination][0] + "'><img src='/image/" + data.destinations[destination][5] + "'></a><div class='destinations_search_info'><a href='/album/" + data.destinations[destination][0] + "' class='city'><h3>" + data.destinations[destination][3] + "</h3></a><p>" + data.destinations[destination][2] + "</p><a class='album_owner' href='#'><i class='material-icons-outlined'>person</i><span>" + data.destinations[destination][4] + "</span></a></div></div>");
                }
            }
            if (data.users) {
                for (user in data.users) {
                    console.log(data.users[user][4]);
                    var profile_img = $SCRIPT_ROOT + "/static/img/avatar.png";
                    if (data.users[user][4]) {
                        profile_img = $SCRIPT_ROOT + "/image/" + data.users[user][4];
                    }
                    $("#users").append("<div class='search_result'><i class='material-icons-outlined'>person</i><div class='search_result_top'><img src='" + profile_img + "'><div class='user_search_info'><h3>" + data.users[user][2] + " " + data.users[user][3] + "</h3></div></div><a href='/profile/" + data.users[user][1] + "' class='username'><span>" + data.users[user][1] + "</span></a></div>")
                }
            };
            $("nav .loader_container").removeClass("is_visible");
        })
};

$("#search_container>a").click(function () {
    if (!$(this).hasClass('is_visible')) {
        $("#search_results, #search, #search_container, #search_container>a").addClass("is_visible");
        $("#search").focus();
        $("#search_container>a>i").html("close");
        $("#search_container>a>span").html("Cancel");
    } else if ($(this).hasClass('is_visible')) {
        $("#search_results, #search, #search_container, #search_container>a").removeClass("is_visible");
        $("#search_container>a>i").html("search");
        $("#search_container>a>span").html("Search");
    }
});