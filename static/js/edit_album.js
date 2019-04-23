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
                                    var post = "<div class='post'><i class='material-icons close'>close</i><i class='material-icons info'>info_outline</i><img src='" + e.target.result + "'><i class='material-icons reorder'>reorder</i></div>";
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
        $("#preview").children(".post").each(function () {
            //Hämtar index/bildurl från src
            var post = $(this);
            var img_url = post.children("img").attr("src");
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
        //Hämtar img_url
        var img_url =  $(this).siblings("img").attr("src");
        //Sätter input för rubrik till värdet i data-attributet "headline"
        $("#modal input[name='headline']").val($(this).parent().data("headline"))
        //Sätter input för beskrivning till värdet i data-attributet "description"
        $("#modal textarea[name='description']").val($(this).parent().data("description"));
        //Sätter rätt img_url
        $("#modal .img_preview").attr("src", img_url);
        //Visar modal
        $("#modal").addClass("is_visible");
    });

    $(".cancel_modal").click(function () {
        //Hämtar img_url
        var img_url = $("#modal .img_preview").attr("src");
        //Hittar .post-elementet med hjälp av img_url
        var post = $(".post > img[src$='" + img_url + "']").parent();
        //Hämtar rubrik och beskrivning
        var headline = $("#modal input[name='headline']").val();
        var description = $("#modal textarea[name='description']").val();

        //Sparar rubrik och beskrivning i data-attribut
        post.data("headline", headline);
        post.data("description", description);
        //#Kontrollera så ovanstående inte är tomma innan dem sätts in i data-attributen#

        //Döljer modal
        $("#modal").removeClass("is_visible");
        //Tömmer fälten för rubrik och beskrivning
        $("#modal input[name='headline']").val("");
        $("#modal textarea[name='description']").val("");
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