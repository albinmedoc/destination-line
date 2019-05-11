//Kontrollerar om username redan finns
var timeout;
$('#search').keypress(function() {
    if(timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    timeout = setTimeout(do_search, 500)
})
var do_search = function(){
    $('.loader_container').addClass('is_visible');
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/request/search",
        data: {
            search: $("#search").val()
        },
        timeout: 35000
    })
    .done(function(data){
        $(".search_category").html('');
        if(data.countries){
            $("#countries").append("<h2>Destinations</h2>");
            for (country in data.countries){
                $("#countries").append("<div class='search_result'><img src='https://i.imgur.com/azjwFrj.jpg'><div class='user_search_info'><span>"+data.countries[country][2]+"</span><a href='/album/"+data.countries[country][0]+"' class='city'><h3>"+data.countries[country][3]+"</h3></a></div></div>")
            }
        }
        if(data.users){
            $("#users").append("<h2>Users</h2>");
            for (user in data.users){
                $("#users").append("<div class='search_result'><img src='https://i.imgur.com/azjwFrj.jpg'><div class='user_search_info'><span>"+data.users[user][2]+" "+data.users[user][3]+"</span><a href='/profile/"+data.users[user][1]+"' class='username'><span>"+data.users[user][1]+"</span></a><div class='follow_info'><a><b>3</b> Followers</a><a><b>24</b> Following</a></div></div></div>")
            }
        }
        $('.loader_container').removeClass('is_visible');
    });
};

$("#search_container>a").click(function(){
    if(!$(this).hasClass('is_visible')){
        $("#search_results").addClass("is_visible");
        $("#search").addClass("is_visible");
        $("#search_container").addClass("is_visible");
        $("#search_container>a").addClass("is_visible");
        $("#search").focus();
        $("#search_container>a>i").html("close");
        $("#search_container>a>span").html("Cancel");
        $("body").css("overflow-y", "hidden");
    }else if ($(this).hasClass('is_visible')){
        $("#search_results").removeClass("is_visible");
        $("#search").removeClass("is_visible");
        $("#search_container").removeClass("is_visible");
        $("#search_container>a").removeClass("is_visible");
        $("#search_container>a>i").html("search");
        $("#search_container>a>span").html("Search");
        $("body").css("overflow-y", "auto");
    }
});

$(document).click(function(e) 
{
    var container = $("#search_container, #search_results, .search_category");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0){
        $("#search_results").removeClass("is_visible");
        $("#search").removeClass("is_visible");
        $("#search_container").removeClass("is_visible");
        $("#search_container>a").removeClass("is_visible");
        $("#search_container>a>i").html("search");
        $("#search_container>a>span").html("Search");
        $("body").css("overflow-y", "auto");
    }
});