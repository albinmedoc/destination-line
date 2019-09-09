window.onload = function () {
    //Visar användare som personen följer
    $("#following_button").click(function () {
        $("#following").addClass("is_visible");
    });
    //Visar användarens följare
    $("#followers_button").click(function () {
        $("#followers").addClass("is_visible");
    });
    //Döljer followers/followings när användaren trycker kryss
    $("#following>i, #followers>i").click(function () {
        $("#following, #followers").removeClass("is_visible");
    });

    //Öppnar input för att välja profilbild
    $("#change_profile_img_btn").click(function () {
        $("#input_profile_img").trigger("click");
    });

    $("#input_profile_img").change(function () {
        var file = this.files[0];
        var data = new FormData();
        //Lägger till bild i FormData
        data.append("file", file);

        //Skickar request till servern
        $.ajax({
            type: 'POST',
            url: $SCRIPT_ROOT + "/upload_profile_img",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                //Visar loading-snurra
                $('.loader_container').addClass('is_visible');
            },
            success: function () {
                location.reload();
            },
            error: function () {
                //Visar felmeddelande
                add_flash_message("Could not change profile image...", "error");
            },
            complete: function () {
                //Döljer loading-snurra
                $('.loader_container').removeClass('is_visible');
            }
        });
    });

    //Öppnar input för att välja profilbild
    $("#change_background_img_btn").click(function () {
        $("#input_background_img").trigger("click");
    });

    $("#input_background_img").change(function () {
        var file = this.files[0];
        var data = new FormData();
        //Lägger till bild i FormData
        data.append("file", file);

        //Skickar request till servern
        $.ajax({
            type: 'POST',
            url: $SCRIPT_ROOT + "/upload_background_img",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                //Visar loading-snurra
                $('.loader_container').addClass('is_visible');
            },
            success: function () {
                location.reload();
            },
            error: function () {
                //Visar felmeddelande
                add_flash_message("Could not change background image...", "error");
            },
            complete: function () {
                //Döljer loading-snurra
                $('.loader_container').removeClass('is_visible');
            }
        });
    });
}