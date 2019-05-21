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
<<<<<<< HEAD

        var current_password = prompt ("Please enter your current password");
        if (current_password==null || current_password == ""){
            alert("you have to write your password")
        }
        else{
            data.append("current_password", current_password);
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
        }
        
=======
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
>>>>>>> 7e00ca7bc31cd0fe423207b43623afdf13125258
    });
});

//Kontrollerar om username redan finns
$("#save_settings > fieldset > .form_row > .input_container > input[name='new_username']").focusout(function(){
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/request/username_exists",
        data: {
            username: $(this).val()
        }
    })
    .done(function(exist){
        if(exist){
            $("#save_setting > fieldset > .form_row > .input_container > input[name='new_username']").addClass("error");
        }else{
            $("#save_setting > fieldset > .form_row > .input_container > input[name='new_username']").removeClass("error");
        }
    });
});