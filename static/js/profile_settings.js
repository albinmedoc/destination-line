$(document).ready(function (){
    //Användarens nuvarande/gamla uppgifter
    var old_username = $("input[name='new_username']").val();
    var old_firstname = $("input[name='new_firstname']").val();
    var old_lastname = $("input[name='new_lastname']").val();
    var old_biography = $("input[name='new_biography']").val();
    var old_email = $("input[name='new_email']").val();

    
    $("#save_settings_button").on("click", function(e){
        //If-satser som kollar om användaren fyller i ett fält med ny data
        e.preventDefault();
        var data = new FormData();
        //Kollar om användaren har ändrat användarnamn
        if(old_username != $("input[name='new_username']").val()){
            data.append("new_username", $("input[name='new_username']").val());
        }
        //Kollar om användaren har ändrat förnamn
        if(old_firstname != $("input[name='new_firstname']").val()){
            data.append("new_firstname", $("input[name='new_firstname']").val());
        }
        //Kollar om användaren har ändrat efternamn
        if(old_lastname != $("input[name='new_lastname']").val()){ 
            data.append("new_lastname", $("input[name='new_lastname']").val());
        }
        //Kollar om användaren har ändrat biografi
        if(old_biography != $("input[name='new_biography']").val()){
            data.append("new_biography", $("input[name='new_biography']").val());  
        }
        //Kollar om användaren har ändrat email
        if(old_email != $("input[name='new_email']").val()){
            data.append("new_email", $("input[name='new_email']").val());   
        }
        //Kollar om användaren har fyllt i båda fälten för att ändra lösenord
        if($("input[name='new_password']").val() == $("input[name='new_password2']").val() && $("input[name='new_password']").val() != ""){
            data.append("new_password", $("input[name='new_password']").val());
        }
        //Pop-up ruta för att bekräfta dina ändringar med ditt nuvarandre lösenord
        var current_password = prompt ("Please enter your current password");
        //Kontrollerar om det inmatade lösenordet lämnades tomt
        if (current_password==null || current_password == ""){
            alert("You have to write your password")
        }
        //Användaren lämnade inte fältet tomt
        else{
            //Skickar den uppdaterade datan till Ajax
            data.append("current_password", current_password);
            //Skickar Post request
            $.ajax({
                url: $SCRIPT_ROOT + "/request/change_settings",
                type: "POST",
                contentType: false,
                data: data,
                processData: false,
                cache: false,
                complete: function(){
                    window.location.assign("/profile");
                    
                }
            });
        }
        
    });

    //Kontrollerar om username redan finns
    $("#upload_form > .form_row > .input_container > input[name='new_username']").focusout(function(){
        if($(this).val().toLowerCase() != old_username.toLowerCase()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/username_exists",
                data: {
                    username: $(this).val()
                }
            })
            .done(function(exist){
                if(exist){
                    $("#upload_form > .form_row > .input_container > input[name='new_username']").addClass("error");
                    $("#upload_form > .form_row > .input_container > #text_varning_username").addClass("error");
                }else{
                    $("#upload_form > .form_row > .input_container > input[name='new_username']").removeClass("error");
                }
            });
        }
    });

    //Kontrollerar om email redan finns
    $("#upload_form > .form_row > .input_container > input[name='new_email']").focusout(function(){
        if($(this).val().toLowerCase() != old_email.toLowerCase()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/email_exists",
                data: {
                    email: $(this).val()
                }
            })
            .done(function(exist){
                if(exist){
                    $("#upload_form> .form_row > .input_container > input[name='new_email']").addClass("error");
                    $("#upload_form > .form_row > .input_container > #text_varning_email").addClass("error");
                }else{
                    $("#upload_form > .form_row > .input_container > input[name='new_email']").removeClass("error");
                }
            });
        }
    });
    //Tar bort röd border och röd text efter error
    $("#upload_form > .form_row > .input_container > input[name='new_username'], #upload_form > .form_row > .input_container > input[name='new_email']",).keyup(function(){
        $("#upload_form > .form_row > .input_container > input[name='new_username']").removeClass("error");
        $("#upload_form > .form_row > .input_container > input[name='new_email']").removeClass("error");
        $("#upload_form > .form_row > .input_container > #text_varning_username").removeClass("error");
        $("#upload_form > .form_row > .input_container > #text_varning_email").removeClass("error");
    });

    $("#delete_account_link").click(function(){

        var answer = confirm("All your albums will be lost, are you sure you want to delete your account?");
        if (answer == true){
            window.location.assign("/delete_account")
        }
    });
});
