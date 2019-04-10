
    $("#login, #register").mousedown(function(e){
        if(e.target.id == "login" || e.target.id == "register"){
            location.hash = '';
        }
    });

    $("#register > fieldset > .form_row > .input_container > input[name='password2']").keyup(function(){
        //Kontrollerar att password2 stämmer överrens med password2
        var pass1 = $("#register > fieldset > .form_row > .input_container > input[name='password']").val()
        var pass2 = $(this).val();
        if($(this).val() != "" && pass1 != pass2){
            console.log("Lösenord matchar inte");
        }
    });

    //Kontrollerar om username redan finns
    $("#register > fieldset > .form_row > .input_container > input[name='username']").focusout(function(){
        $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request",
            data: {
                request: "username_exists",
                username: $(this).val()
            }
        })
        .done(function(response){
            //response, True eller False
            //Sant om användaren finns
            //$(this) är input för användarnamn
            console.log("Username:" + response);
        });
    });

    //Kontrollerar om email redan finns
    $("#register > fieldset > .form_row > .input_container > input[name='email']").focusout(function(){
        $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request",
            data: {
                request: "email_exists",
                email: $(this).val()
            }
        })
        .done(function(response){
            //response, True eller False
            //Sant om användaren finns
            //$(this) är input för email
            console.log("Email:" + response);
        });
    });