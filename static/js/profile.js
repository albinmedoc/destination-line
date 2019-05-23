window.onload = function () {

    $("#following_button, #followers_button").click(function(){
        $("#following").addClass("is_visible");
    });
    $("#following>i, #followers>i").click(function(){
        $("#following, #followers").removeClass("is_visible");
    });


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
   //Öppnar input för att välja profilbild
    $("#change_profile_img_btn").click(function(){
        $("#input_profile_img").trigger("click");
    });
    
    $("#input_profile_img").change(function(){
        var file = this.files[0];
        var data = new FormData();
        data.append("file", file);

        $.ajax({
            type: 'POST',
            url: $SCRIPT_ROOT + "/upload_profile_img",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('.loader_container').addClass('is_visible');
            },
            success: function(data){
                add_flash_message("Profile image changed", "success");
                $("#profile_img > img").attr("src", $SCRIPT_ROOT + "/image/" + data);
            },
            error: function(data){
                add_flash_message("Could not change profile image...", "error");
            },
            complete: function(){
                $('.loader_container').removeClass('is_visible');
            }
        });
    });

    //Öppnar input för att välja profilbild
    $("#change_background_img_btn").click(function(){
        $("#input_background_img").trigger("click");
    });
    
    $("#input_background_img").change(function(){
        var file = this.files[0];
        var data = new FormData();
        data.append("file", file);

        $.ajax({
            type: 'POST',
            url: $SCRIPT_ROOT + "/upload_background_img",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('.loader_container').addClass('is_visible');
            },
            success: function(data){
                add_flash_message("Background image changed", "success");
                $("#profile_header").css("background-image", "url(" + $SCRIPT_ROOT + "/image/" + data + ")");
            },
            error: function(data){
                add_flash_message("Could not change background image...", "error");
            },
            complete: function(){
                $('.loader_container').removeClass('is_visible');
            }
        });
    });
}
