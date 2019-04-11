$(document).ready(function(){
    var images = [];

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
                            if(images.indexOf(e.target.result) < 0){
                                images.push(e.target.result);
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
        console.log(index);
        images.splice(images.indexOf(index), 1);
        $(this).parent().remove();
    });

    $("#upload_form").on("submit", function(e){
        e.preventDefault();
        console.log(images);

    });

    Sortable.create(test, {
        animation: 500,
        draggable: ".post",
        scroll: true,
        scrollSensitivity: 50,
    });
  
});