$(document).ready(function(){
    var images = new Object();

    $("#upload_btn").click(function(){
        $("#upload").trigger("click");
    });

    $("#upload").change(function(){
        if(this.files && this.files.length <= 60){
            for(var i = 0; i < this.files.length; i++){
                var file = this.files[i];
                if(file.type.match("image.*")){
                    var reader = new FileReader();
                    reader.onload = (function(file){
                        return function(e){
                            if(!(e.target.result in images)){
                                images[e.target.result] = file;
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
                    alert("The file " + file.name + " is not an image. Skipping..");
                }
            }
        }
    });

    $("#upload_btn").parent().on("click", ".post > i.close", function(){
        var index = $(this).next().attr("src");
        delete images[index];
        $(this).parent().remove();
    });

    $("#upload_form").on("submit", function(e){
        e.preventDefault();
        var data = new FormData();
        data.append("country", $("#country").val());
        data.append("city", $("#city").val());
        data.append("date_start", $("#date_start").val());
        data.append("date_end", $("#date_end").val());

        var i = 1;
        $("#upload_btn").parent().children(".post").each(function(){
            var index = $(this).children("img").attr("src");
            data.append("file" + i, images[index]);
            i++;
        });
        $.ajax({
            url: $SCRIPT_ROOT + "/upload",
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

    Sortable.create(preview, {
        animation: 500,
        draggable: ".post",
        scroll: true,
        scrollSensitivity: 50,
    });
  
});