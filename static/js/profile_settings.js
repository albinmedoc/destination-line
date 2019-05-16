$(document).ready(function (){
    var old_username = $("input[name='new_username']").val();
    var old_email = $("input[name='new_email']").val();
    var old_firstname = $("input[name='new_firstname']").val();
    var old_lastname = $("input[name='new_lastname']").val();
    var old_biography = $("input[name='new_biography']").val();

    $("#upload_form").on("submit", function(e){
        e.preventDefault();
        if(old_username != $("new_username").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_username",
                data: {
                    new_username: $("new_username").val()
                }
            }).done(function(success){
                if(success){
                    alert("Username changed!");
                }
            });
        }

        //Nästa if
        if(old_firstname != $("new_firstname").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_firstname",
                data: {
                    new_firstname: $("new_firstname").val()
                }
            }).done(function(success){
                if(success){
                    alert("Firstname changed!");
                }
            });
        }

        //Nästa if
        if(old_firstname != $("new_lastname").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_lastname",
                data: {
                    new_lastname: $("new_lastname").val()
                }
            }).done(function(success){
                if(success){
                    alert("Lastname changed!");
                }
            });
        }

        //Nästa if
        if(old_biography != $("new_biography").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_biography",
                data: {
                    new_biography: $("new_biography").val()
                }
            }).done(function(success){
                if(success){
                    alert("Biography changed!");
                }
            });
        }

        if(old_email != $("new_email").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_email",
                data: {
                    new_email: $("new_email").val()
                }
            }).done(function(success){
                if(success){
                    alert("Email changed!");
                }
            });
        }

        if(old_password != $("new_password").val()){
            $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/request/change_password",
                data: {
                    new_password: $("new_password").val()
                }
            }).done(function(success){
                if(success){
                    alert("Password changed!");
                }
            });
        }
    });
});