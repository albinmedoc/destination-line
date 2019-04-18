$(document).ready(function () {
    var images = new Object();
//images[key] = ["Fil", "Titel", "Beskrivning"]

    var period = new Lightpick({
        field: document.getElementById("period"),
        singleDate: false,
        format: "YYYY-MM-DD"
    });

    $("#upload_btn").click(function () {
        $("#upload").trigger("click");
    });

    $("#upload").change(function () {
        if (this.files && this.files.length <= 60) {
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
                                    var post = "<div class='post'><i class='material-icons close'>close</i><img src='" + e.target.result + "'><i class='material-icons info'>list</i>";
                                    $("#upload_btn").after(post);
                                } else {
                                    alert("The image " + file.name + " has already been uploaded. Skipping..")
                                }
                            }
                        })(file);
                        reader.readAsDataURL(file);
                        console.log(file);
                    } else {
                        alert("The image " + file.name + " is too large. Skipping..");
                    }
                } else {
                    alert("The file " + file.name + " is not an image. Skipping..");
                }
            }
        }
        //Rensa fil-input
        $(this).val("");
    });

    $("#upload_btn").parent().on("click", ".post > i.close", function () {
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
        $("#upload_btn").parent().children(".post").each(function () {
            //Hämtar index/bildurl från src
            var img_url = $(this).children("img").attr("src");
            data.append("post" + i, images[img_url][0]);
            //Kollar om rubrik är angivet
            if(typeof images[img_url][1] !== 'undefined') {
                //Skickar med rubrik
                data.append("headline" + i, images[img_url][1]);
            }
            //Kollar om beskrivning är angivet
            if(typeof images[img_url][2] !== 'undefined') {
                //Skickar med beskrivning
                data.append("description" + i, images[img_url][2]);
            }
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

    $("#upload_btn").parent().on("click", ".post > i.info", function () {
        var img_url =  $(this).siblings("img").attr("src");
        if(typeof images[img_url][1] !== 'undefined') {
            $("#modal input[name='headline']").val(images[img_url][1])
        }
        if(typeof images[img_url][2] !== 'undefined') {
            $("#modal textarea[name='description']").val(images[img_url][2]);
        }
        $("#modal .img_preview").attr("src", img_url);
        $("#modal").addClass("is_visible");
    });

    $(".cancel_modal").click(function () {
        var img_url = $("#modal .img_preview").attr("src");
        images[img_url][1] = $("#modal input[name='headline']").val();
        images[img_url][2] = $("#modal textarea[name='description']").val();
        //Kontrollera så ovanstående inte är tomma
        $("#modal").removeClass("is_visible");
        $("#modal input[name='headline']").val("");
        $("#modal textarea[name='description']").val("");
    });

    //Gör inläggen flyttbara
    Sortable.create(preview, {
        animation: 500,
        draggable: ".post",
        scroll: true,
        scrollSensitivity: 50,
        delay: 200
    });

});