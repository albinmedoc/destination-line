//Kontrollerar om username redan finns
var timeout;
$('#search').keyup(function() {
    if(timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    timeout = setTimeout(do_search, 500)
})
var do_search = function(){
    $("nav .loader_container").addClass("is_visible"); 
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
            for (country in data.countries){
                $("#destinations").append("<div class='search_result'><i class='material-icons'>place</i><a href='/album/"+data.countries[country][0]+"'><img src='https://i.imgur.com/RhIOo8D.jpg'></a><div class='destinations_search_info'><a href='/album/"+data.countries[country][0]+"' class='city'><h3>"+data.countries[country][3]+"</h3></a><p>"+data.countries[country][2]+"</p><a class='album_owner' href='#'><i class='material-icons'>person_outline</i><span>"+data.countries[country][4]+"</span></a></div></div>");
            }
        }
        if(data.users){
            for (user in data.users){
                $("#users").append("<div class='search_result'><i class='material-icons'>person_outline</i><div class='search_result_top'><img src='https://i.imgur.com/5o1TAya.jpg'><div class='user_search_info'><h3>"+data.users[user][2]+" "+data.users[user][3]+"</h3><div class='follow_info'><a><h4>3</h4> <span>Followers</span></a><a><h4>3</h4> <span>Follow</span></a></div></div></div><a href='/profile/"+data.users[user][1]+"' class='username'><span>"+data.users[user][1]+"</span></a></div>")
            }
        };
        $("nav .loader_container").removeClass("is_visible");
    })
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