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
    });
});