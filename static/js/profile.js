window.onload = function () {
    $(".button_container.follow").click(function(){
        var target_name = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
        $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request/follow",
            data: {
                target_name: target_name
            }
        })
        .done(function(){
            $( ".follow i" ).html("favorite");
            $( ".follow span" ).html("Unfollow");
        });
    });
    $("#change_profile_img_btn").click(function(){
        $("#input_profile_img").trigger("click");
    });
}
