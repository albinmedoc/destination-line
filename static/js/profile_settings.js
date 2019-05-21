$(document).ready(function (){
    var old_username = $("input[name='new_username']").val();
    var old_firstname = $("input[name='new_firstname']").val();
    var old_lastname = $("input[name='new_lastname']").val();
    var old_biography = $("input[name='new_biography']").val();
    var old_email = $("input[name='new_email']").val();

    $("#save_settings_button").on("click", function(e){
        e.preventDefault();
        var data = new FormData();
        if(old_username != $("input[name='new_username']").val()){
            data.append("new_username", $("input[name='new_username']").val());
        }

        //Nästa if
        if(old_firstname != $("input[name='new_firstname']").val()){
            data.append("new_firstname", $("input[name='new_firstname']").val());
        }

        //Nästa if
        if(old_lastname != $("input[name='new_lastname']").val()){ 
            data.append("new_lastname", $("input[name='new_lastname']").val());
        }

        //Nästa if
        if(old_biography != $("input[name='new_biography']").val()){
            data.append("new_biography", $("input[name='new_biography']").val());  
        }

        if(old_email != $("input[name='new_email']").val()){
            data.append("new_email", $("input[name='new_email']").val());   
        }

        if($("input[name='new_password']").val() == $("input[name='new_password2']").val() && $("input[name='new_password']").val() != ""){
            data.append("new_password", $("input[name='new_password']").val());
        }

        $.ajax({
            url: $SCRIPT_ROOT + "/request/change_settings",
            type: "POST",
            contentType: false,
            data: data,
            processData: false,
            cache: false,
            complete: function(){
                alert("Skickades");
            }
        });
    });
});
