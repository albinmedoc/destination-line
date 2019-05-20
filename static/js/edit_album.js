//Maxgräns för bilder
var UPLOAD_LIMIT = 4;
var FILE_SIZE_LIMIT = 6000000;
var ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

//Valda bilder sparas i denna variablen
var images = new Object();

$(document).ready(function (){

    //Öppna fil-väjare
    $("#upload_btn").click(function () {
        $("#upload").trigger("click");
    });

    //När file-input ändras, dvs när användaren har valt bild/bilder
    $("#upload").change(function (){
        for (var i = 0; i < this.files.length; i++) {
            var file = this.files[i];

            //Skippar fil om extensionen eller filstorleken inte tillfredställs
            if(!check_file_extension(file) || !check_file_size(file)){
                continue;
            }

            var reader = new FileReader();
            reader.onload = (function(file){
                //Skippar ifall bild redan vald
                return function(e){
                    if(check_if_already_choosed(file, e.target.result)){
                        return;
                    }
    
                    //Avbryter ifall 50 eller fler bilder är valda
                    if(Object.keys(images).length >= UPLOAD_LIMIT){
                        alert(UPLOAD_LIMIT + " images is maximum for an album.");
                        return;
                    }
    
                    //Spara bild i variabel, bild-url som nyckel
                    images[e.target.result] = file;
                    
                    //Visa bild
                    display_image(file, e.target.result);
                }
            })(file);
            reader.readAsDataURL(file);
        }
        $(this).val("");
    });
});

//Kontrollera att filextensionen är tillåten
function check_file_extension(file){
    extension = file.name.split('.').pop().toLowerCase();
    allowed = ALLOWED_EXTENSIONS.indexOf(extension) > -1;
    //Meddelar användaren om filextensionen inte är tillåten
    if(!allowed) alert(file.name + " doesn´t have an allowed extension.");
    return allowed;
}

//Kontrollerar att filstorleken inte överstiger maxgränsen
function check_file_size(file){
    allowed = file.size <= FILE_SIZE_LIMIT;
    if(!allowed) alert(file.name + " is too big.");
    return allowed;
}

//Kontrollerar ifall bild redan uppladdad
function check_if_already_choosed(file, img_url){
    exists = img_url in images;
    if(exists) alert(file.name + " is already choosed.");
    return exists;
}

//Visa bild
function display_image(file, img_url){
    var post = "<div class='post' data-headline='' data-description=''><div class='button_container img_close'><div class='button_text_container'><span>Delete image</span></div><i class='material-icons button_icon_container'>close</i></div><div class='button_container img_modal_open'><i class='material-icons button_icon_container'>info</i><div class='button_text_container'><span>Image info</span></div></div><img src='" + img_url + "' alt='" + file.name + "'><i class='material-icons reorder'>reorder</i></div>";
    $("#upload_btn").after(post);
}

$(document).ready(function (){
    //Ta bort bild från variabel och från gränssnittet när användaren klickar kryss på en bild
    $("#upload_btn").parent().on("click", ".img_close", function () {
        var index = $(this).next().attr("src");
        delete images[index];
        $(this).parent().remove();
    });

    //Öppna ruta för att lägga till titel och beskrivning för bild
    $("#upload_btn").parent().on("click", ".img_modal_open", function () {

        //Sätter input för rubrik till värdet i data-attributet "headline"
        $("#img_info_modal input[name='headline']").val($(this).parent().attr("data-headline"))

        //Sätter input för beskrivning till värdet i data-attributet "description"
        $("#img_info_modal textarea[name='description']").val($(this).parent().attr("data-description"));

        //Sätter rätt img_url
        $("#img_info_modal .img_preview").attr("src", $(this).siblings("img").attr("src"));

        //Visar modal
        $("#img_info_modal, .image_info").addClass("is_visible");
    });

    //Spara titel och beskrivning när rutan stängs
    $("#modal_save_img_info").click(function () {

        //Hämtar img_url
        var img_url = $("#img_info_modal .img_preview").attr("src");

        //Hittar .post-elementet med hjälp av img_url
        var post = $(".post img[src$='" + img_url + "']").parent();

        //Hämtar rubrik och beskrivning
        var headline = $("#img_info_modal input[name='headline']").val();
        var description = $("#img_info_modal textarea[name='description']").val();

        //Sparar rubrik och beskrivning i data-attribut
        post.attr("data-headline", headline);
        post.attr("data-description", description);

        //Döljer modal
        $("#img_info_modal, .image_info").removeClass("is_visible");

        //Tömmer fälten för rubrik och beskrivning
        $("#img_info_modal input[name='headline']").val("");
        $("#img_info_modal textarea[name='description']").val("");
    });
    
    $(".cancel_modal").click(function () {
        
        //Döljer modal
        $("#img_info_modal, .image_info").removeClass("is_visible");

  
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

//Date-picker
var period = new Lightpick({
    field: document.getElementById("period"),
    singleDate: false,
    format: "YYYY-MM-DD",
    //Gör så det inte går att välja ett datum i framtiden
    maxDate: moment()
});

//Laddar upp album
$("#upload_form").on("submit", function (e) {
    e.preventDefault();
    if(Object.keys(images).length == 0){
        alert("Inga valda bilder");
        return;
    }
    $('#upload_progress_bar').css('width', '10%');
    console.log(images);
    var data = new FormData();
    //Lägger till album information i FormData
    data.append("country", $("#country").val());
    data.append("city", $("#city").val());
    var date_start = period.getStartDate();
    var date_end = period.getEndDate();
    //Sätter båda datumen till samma ifall endast ett var angivet
    if(!date_end){
        date_end = date_start;
    }
    data.append("date_start", date_start.format("YYYY-MM-DD"));
    data.append("date_end", date_end.format("YYYY-MM-DD"));
    var i = 1;
    //Lägger till alla bilder i FormData
    $("#preview").children(".post").each(function () {
        //Hämtar index/bildurl från src
        var post = $(this);
        var img_url = post.children("img").attr("src");
        data.append("post" + i, images[img_url]);
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
        beforeSend: function(){
            $('.loader_container').addClass('is_visible');
        },
        success: function () {
            alert("Uploaded");
        },
        error: function () {
            alert("Error");
        },
        complete: function(){
            $('.loader_container').removeClass('is_visible');
        }
    });
});