// Öppnar modal
$("#login_register_open").click(function() {
    $("#login_register_modal").addClass("is_visible");
});

// Stänger modal
$(".cancel_modal").click(function() {
    $(".modal").removeClass("is_visible");
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
        url: $SCRIPT_ROOT + "/request/username_exists",
        data: {
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
        url: $SCRIPT_ROOT + "/request/email_exists",
        data: {
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
        },
        beforeSend: function(){
            $('.loader_container').addClass('is_visible');
        },
        complete: function(valid){
            if(!valid){
                $("#login > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
                $("#login > fieldset > .form_row > .input_container > input[name='password']").addClass("error");
    
            }else{
                location.replace("/");
            }
            $('.loader_container').removeClass('is_visible');
        }
    });
    e.preventDefault();
});

/* $('#register').on('submit', function(e) {
    $('.loader_container').addClass('is_visible');
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/register",
        data: {
            firstname: $("#register > fieldset > .form_row > .input_container > input[name='firstname']").val(),
            lastname: $("#register > fieldset > .form_row > .input_container > input[name='lastname']").val(),
            username: $("#register > fieldset > .form_row > .input_container > input[name='username']").val(),
            email: $("#register > fieldset > .form_row > .input_container > input[name='email']").val(),
            password: $("#register > fieldset > .form_row > .input_container > input[name='password']").val()
        }
    })
    .done(function(valid){
        if(!valid){
            $("#register > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
            $("#register > fieldset > .form_row > .input_container > input[name='password']").addClass("error");

        }else{
            location.replace("/");
        }
        $('.loader_container').removeClass('is_visible');
    });
    e.preventDefault();
}); */