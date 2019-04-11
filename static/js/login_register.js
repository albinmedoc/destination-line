
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
        $(this).addClass("error");
    }else{
        $(this).removeClass("error");
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
    .done(function(exist){
        if(exist){
            $("#register > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
        }else{
            $("#register > fieldset > .form_row > .input_container > input[name='username']").removeClass("error");
        }
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
    .done(function(exist){
        if(exist){
            $("#register > fieldset > .form_row > .input_container > input[name='email']").addClass("error");
        }else{
            $("#register > fieldset > .form_row > .input_container > input[name='email']").removeClass("error");
        }
    });
});


$('#login').on('submit', function(e) {
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/login",
        data: {
            username: $("#login > fieldset > .form_row > .input_container > input[name='username']").val(),
            password: $("#login > fieldset > .form_row > .input_container > input[name='password']").val()
        }
    })
    .done(function(valid){
        if(!valid){
            $("#login > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
            $("#login > fieldset > .form_row > .input_container > input[name='password']").addClass("error");

        }else{
            location.reload();
        }
    });
    e.preventDefault();
});