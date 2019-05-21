window.onload = function () {
    $(".button_container.follow").click(function(){
        var target_name = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
        //Användaren skall följa
        if($( ".follow span" ).html() == "Follow"){
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
        }
        //Användaren skall avfölja
        else{
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/unfollow",
                data: {
                    target_name: target_name
                }
            })
            .done(function(){
                $( ".follow i" ).html("favorite_border");
                $( ".follow span" ).html("Follow");
            });
        }
    });
    $("#change_profile_img_btn").click(function(){
        $("#input_profile_img").trigger("click");
    });
    $("#input_profile_img").change(function(){
        alert("kebab");
        var file = this.files[0];
        var data = new FormData();
        data.append("file", file);
        $.ajax({
            url: $SCRIPT_ROOT + "/upload_profile_img", 
            type: "POST", 
            contentType: false, 
            procesData: false,
            cache: false, 
            data: data,
            complete: function(){
                alert("kebabrulle");
            }
        });

    });
}
