$(document).ready(function(){
    var images = new Object();

    $("#upload_btn").click(function(){
        $("#upload").trigger("click");
    });

    $("#upload").change(function(){
        if(this.files && this.files.length <= 60){
            for(var i = 0; i < this.files.length; i++){
                var file = this.files[i];
                //Kollar om filen har bildformat
                if(file.type.match("image.*")){
                    console.log(file.size)
                    if(file.size <= 6000000){
                        var reader = new FileReader();
                        reader.onload = (function(file){
                            return function(e){
                                //Kollar om bilden redan är i listan
                                if(!(e.target.result in images)){
                                    //Sparar filen i Listan
                                    images[e.target.result] = file;
                                    //Visar bilder
                                    var post = "<div class='post'><i class='material-icons close'>close</i><img src='" + e.target.result + "'><i class='material-icons info'>list</i>";
                                    $("#upload_btn").after(post);
                                }else{
                                    alert("The image " + file.name + " has already been uploaded. Skipping..")
                                }
                            }
                        })(file);
                        reader.readAsDataURL(file);
                        console.log(file);
                    }else{
                        alert("The image " + file.name + " is too large. Skipping..");
                    }
                }else{
                    alert("The file " + file.name + " is not an image. Skipping..");
                }
            }
        }
        //Rensa fil-input
        $(this).val("");
    });

    $("#upload_btn").parent().on("click", ".post > i.close", function(){
        var index = $(this).next().attr("src");
        delete images[index];
        $(this).parent().remove();
    });

    $("#upload_form").on("submit", function(e){
        e.preventDefault();
        var data = new FormData();
        //Lägger till album information i FormData
        data.append("country", $("#country").val());
        data.append("city", $("#city").val());
        data.append("date_start", $("#date_start").val());
        data.append("date_end", $("#date_end").val());

        var i = 1;
        //Lägger till alla filer i FormData
        $("#upload_btn").parent().children(".post").each(function(){
            //Hämtar index/bildurl från src
            var index = $(this).children("img").attr("src");
            data.append("file" + i, images[index]);
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
            success: function() {
                alert("Uploaded");
            },
            error: function(){
                alert("Error");
            }
        });
    });

    //Gör inläggen flyttbara
    Sortable.create(preview, {
        animation: 500,
        draggable: ".post",
        scroll: true,
        scrollSensitivity: 50,
    });
  
});