//Maxgräns för bilder
var UPLOAD_LIMIT = 50;
var FILE_SIZE_LIMIT = 6000000;
var ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

//Valda bilder sparas i denna variablen
var images = [];
var editing = false;

$(document).ready(function (){
    //Loopar igenom alla posts (endast ifall man ändrar ett album finns dessa)
    $("#preview").children(".post").each(function (){
        //Sätter editing till sant eftersom en eller flera posts finns från start
        editing = true;

        //Gör om till Image objekt så vi kan rita på canvas
        var image = new Image();
        image.src = $(this).children("img").attr("src");
        image.post = $(this);
        image.onload = function(){
            //Skapar en canvas för att kunna hämta DataURL
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            //Hämtar DataURL
            var data_url = canvas.toDataURL();
            
            images.push(data_url);

            //Uppdaterar post > img till den nya urlen för bilden
            image.post.children("img").attr("src", data_url);
        }
    });

    $("textarea[name='description']").keyup(function(){
        if($(this).val().len() > 2500){
            $(this).addClass("error");
        }
    });

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
                return function(e){
                    //Skippar ifall bild redan vald
                    if(check_if_already_choosed(e.target.result)){
                        add_flash_message(file.name + " is already choosed.", "error");
                        return;
                    }
    
                    //Avbryter ifall 50 eller fler bilder är valda
                    if(Object.keys(images).length >= UPLOAD_LIMIT){
                        add_flash_message(UPLOAD_LIMIT + " images is maximum for an album.", "error");
                        return;
                    }
    
                    //Spara bild i variabel, bild-url som nyckel
                    images.push(e.target.result);
                    
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
    if(!allowed) add_flash_message(file.name + " doesn´t have an allowed extension.", "error");
    return allowed;
}

//Kontrollerar att filstorleken inte överstiger maxgränsen
function check_file_size(file){
    allowed = file.size <= FILE_SIZE_LIMIT;
    if(!allowed) add_flash_message(file.name + " is too big.", "error");
    return allowed;
}

//Kontrollerar ifall bild redan uppladdad
function check_if_already_choosed(file, img_url){
    $("#preview").children(".post > img").each(function () {
        if($(this).attr("src") == img_url) return true;
        return false;
    });
}

//Visa bild
function display_image(file, img_url){
    var post = "<div class='post' data-headline='' data-description=''><div class='button_container img_close'><div class='button_text_container'><span>Delete image</span></div><i class='material-icons button_icon_container'>close</i></div><div class='button_container img_modal_open'><i class='material-icons button_icon_container'>info</i><div class='button_text_container'><span>Image info</span></div></div><img src='" + img_url + "' alt='" + file.name + "'><i class='material-icons reorder'>reorder</i></div>";
    $("#upload_btn").after(post);
}

$(document).ready(function (){
    $(".cancel_upload").click(function(){

        var answer = confirm("All your changes will be lost, are you sure you want to cancel?");
        if (answer == true){
            window.location.assign("/profile")
        }
    });
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
        add_flash_message("No choosen images.", "error");
        return;
    }
    $('#upload_progress_bar').css('width', '10%');
    var data = new FormData();
    //Lägger till ifall man redigerar album eller ej (true= ändrar album, false=skapar nytt album)
    if(editing){
        var album_id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
        data.append("album_id", album_id);
    }
    //Lägger till album information i FormData
    data.append("country", $("#country").val());
    data.append("city", $("#city").val());
    var date_start = period.getStartDate();
    var date_end = period.getEndDate();

    //Sätter båda datumen till samma ifall endast ett var angivet
    if(!date_end) date_end = date_start;
    
    data.append("date_start", date_start.format("YYYY-MM-DD"));
    data.append("date_end", date_end.format("YYYY-MM-DD"));
    var i = 0;
    //Lägger till alla bilder i FormData
    $("#preview").children(".post").each(function () {
        //Hämtar index/bildurl från src
        var post = $(this);
        var img_url = post.children("img").attr("src");
        data.append("post" + i, blob_to_file(data_uri_to_blob(img_url), "test.png"));
        data.append("headline" + i, post.attr("data-headline"));
        data.append("description" + i, post.attr("data-description"));
        i++;
    });

    //Skickar Post-request
    $.ajax({
        url: $SCRIPT_ROOT + "/new/album",
        type: 'POST',
        dataType: "json",
        contentType: false,
        data: data,
        processData: false,
        cache: false,
        beforeSend: function(){
            $('.loader_container').addClass('is_visible');
        },
        success: function (data) {
            window.location.assign($SCRIPT_ROOT + "/album/" + data);
        },
        error: function () {
            add_flash_message("Something went wrong...", "error");
        },
        complete: function(data){
            $('.loader_container').removeClass('is_visible');
        }
    });
});

function data_uri_to_blob(dataURI){
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

function blob_to_file(blob, filename){
    console.log(blob);
    var file = new File([blob], filename, {type: "image/jpeg", lastModified: Date.now()});
    console.log(file);
    console.log(file.size);
    return file;
}