$(document).ready(function () {
    var images = new Object();
//images[key] = ["Fil", "Titel", "Beskrivning"]

    var period = new Lightpick({
        field: document.getElementById("period"),
        singleDate: false,
        format: "YYYY-MM-DD",
        maxDate: moment()
    });

    $("#upload_btn").click(function () {
        $("#upload").trigger("click");
    });

    $("#upload").change(function () {
        if (this.files && this.files.length <= 60) {
            var steps = 100 / this.files.length;
            var width = 0;
            $("#upload_progress_bar").css("width", width + "%");
            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];
                //Kollar om filen har bildformat
                if (file.type.match("image.*")) {
                    console.log(file.size)
                    if (file.size <= 6000000) {
                        var reader = new FileReader();
                        reader.onload = (function (file) {
                            return function (e) {
                                image = new Image();
                                image.onload = function (e) {
                                    return function (e) {
                                        console.log(image.width);
                                        console.log(image.height);
                                    }
                                }(e);
                                image.src = e.target.result;
                                //Kollar om bilden redan är i listan
                                if (!(e.target.result in images)) {
                                    //Sparar filen i Listan
                                    images[e.target.result] = [];
                                    images[e.target.result][0] = file;
                                    //Visar bilder
                                    var post = "<div class='post' data-headline='' data-description=''><div class='button_container img_close'><div class='button_text_container'><span>Delete image</span></div><i class='material-icons button_icon_container'>close</i></div><div class='button_container img_modal_open'><i class='material-icons button_icon_container'>info</i><div class='button_text_container'><span>Image info</span></div></div><img src='" + e.target.result + "'><i class='material-icons reorder'>reorder</i></div>";
                                    $("#upload_btn").after(post);
                                    width = width + steps;
                                    $("#upload_progress_bar").css("width", width + "%");
                                } else {
                                    alert("The image " + file.name + " has already been uploaded. Skipping..");
                                    width = width + steps;
                                    $("#upload_progress_bar").css("width", width + "%");
                                }
                            }
                        })(file);
                        reader.readAsDataURL(file);
                        console.log(file);
                    } else {
                        alert("The image " + file.name + " is too large. Skipping..");
                        width = width + steps;
                        $("#upload_progress_bar").css("width", width + "%");
                    }
                } else {
                    alert("The file " + file.name + " is not an image. Skipping..");
                    width = width + steps;
                    $("#upload_progress_bar").css("width", width + "%");
                }
            }
            
        }
        //Rensa fil-input
        $(this).val("");
    });

    $("#upload_btn").parent().on("click", ".img_close", function () {
        var index = $(this).next().attr("src");
        delete images[index];
        $(this).parent().remove();
    });

    $("#upload_form").on("submit", function (e) {
        console.log(images);
        e.preventDefault();
        var data = new FormData();
        //Lägger till album information i FormData
        data.append("country", $("#country").val());
        data.append("city", $("#city").val());
        data.append("date_start", period.getStartDate().format("YYYY-MM-DD"));
        data.append("date_end", period.getEndDate().format("YYYY-MM-DD"));

        var i = 1;
        //Lägger till alla filer i FormData
        $("#preview").children(".post").each(function () {
            //Hämtar index/bildurl från src
            var post = $(this);
            var img_url = post.children("img").attr("src");
            data.append("post" + i, images[img_url][0]);
            //Kollar om rubrik är angivet
            if(typeof images[img_url][1] !== 'undefined') {
                //Skickar med rubrik
                
            }
            //Kollar om beskrivning är angivet
            if(typeof images[img_url][2] !== 'undefined') {
                //Skickar med beskrivning
                
            }
            data.append("headline" + i, post.attr("data-headline"));
            data.append("description" + i, post.attr("data-description"));
            i++;
        });
        //Skickar Post-request
        $.ajax({
            url: $SCRIPT_ROOT + "/new/album",
            type: 'POST',
            contentType: false,
            data: data,
            processData: false,
            cache: false,
            success: function () {
                alert("Uploaded");
            },
            error: function () {
                alert("Error");
            }
        });
    });

    $("#upload_btn").parent().on("click", ".img_modal_open", function () {
        //Hämtar img_url
        var img_url =  $(this).siblings("img").attr("src");
        //Sätter input för rubrik till värdet i data-attributet "headline"
        $("#img_info_modal input[name='headline']").val($(this).parent().data("headline"))
        //Sätter input för beskrivning till värdet i data-attributet "description"
        $("#img_info_modal textarea[name='description']").val($(this).parent().data("description"));
        //Sätter rätt img_url
        $("#img_info_modal .img_preview").attr("src", img_url);
        //Visar modal
        $("#img_info_modal, .image_info").addClass("is_visible");
    });

    $(".cancel_modal").click(function () {
        //Hämtar img_url
        var img_url = $("#img_info_modal .img_preview").attr("src");
        //Hittar .post-elementet med hjälp av img_url
        var post = $(".post > img[src$='" + img_url + "']").parent();
        //Hämtar rubrik och beskrivning
        var headline = $("#img_info_modal input[name='headline']").val();
        var description = $("#img_info_modal textarea[name='description']").val();
        console.log(headline);
        console.log(description);

        //Sparar rubrik och beskrivning i data-attribut
        post.attr("data-headline", headline);
        post.attr("data-description", description);
        console.log(post[0]);
        //#Kontrollera så ovanstående inte är tomma innan dem sätts in i data-attributen#

        //Döljer modal
        $("#img_info_modal, .image_info").removeClass("is_visible");
        //Tömmer fälten för rubrik och beskrivning
        $("#img_info_modal input[name='headline']").val("");
        $("#img_info_modal textarea[name='description']").val("");
    });

    //Gör inläggen flyttbara, är det mobil måste man dra på ".reorder"-elementet
    if(window.mobileAndTabletcheck()){
        Sortable.create(preview, {
            animation: 500,
            draggable: ".post",
            scroll: true,
            scrollSensitivity: 50,
            handle: ".reorder"
        });
    }else{
        Sortable.create(preview, {
            animation: 500,
            draggable: ".post",
            scroll: true,
            scrollSensitivity: 50
        });
    }
});