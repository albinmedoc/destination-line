// Öppnar modal
$("#login_register_open").click(function () {
    $("#login_register_modal").addClass("is_visible");
});

// Stänger modal
$(".cancel_modal").click(function () {
    $(".modal").removeClass("is_visible");
});

$("#register input[name='password2'], #register input[name='password']").keyup(function () {
    //Kontrollerar att password2 stämmer överrens med password2
    var pass1 = $("#register > fieldset > .form_row > .input_container > input[name='password']").val()
    var pass2 = $("#register > fieldset > .form_row > .input_container > input[name='password2']").val();
    if (pass2 != "" && pass1 != pass2) {
        $("#register input[name='password2']").addClass("error");
    } else {
        $("#register input[name='password2']").removeClass("error");
    }
});

//Kontrollerar om username redan finns
$("#register > fieldset > .form_row > .input_container > input[name='username']").focusout(function () {
    $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request/username_exists",
            data: {
                username: $(this).val()
            }
        })
        .done(function (exist) {
            if (exist) {
                $("#register > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
                $("#register > fieldset > .form_row > .input_container > #text_warning_register_username").addClass("error");
            } else {
                $("#register > fieldset > .form_row > .input_container > input[name='username']").removeClass("error");
                $("#register > fieldset > .form_row > .input_container > #text_warning_register_username").removeClass("error");
            }
        });
});

//Kontrollerar om email redan finns
$("#register > fieldset > .form_row > .input_container > input[name='email']").focusout(function () {
    $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request/email_exists",
            data: {
                email: $(this).val()
            }
        })
        .done(function (exist) {
            if (exist) {
                $("#register > fieldset > .form_row > .input_container > input[name='email']").addClass("error");
                $("#register > fieldset > .form_row > .input_container > #text_warning_register_email").addClass("error");
            } else {
                $("#register > fieldset > .form_row > .input_container > input[name='email']").removeClass("error");
                $("#register > fieldset > .form_row > .input_container > #text_warning_register_email").removeClass("error");
            }
        });
});

//Tar bort röd border efter error
$("#login > fieldset > .form_row > .input_container > input[name='username'], #login > fieldset > .form_row > .input_container > input[name='password']", ).keyup(function () {
    $("#login > fieldset > .form_row > .input_container > input[name='username']").removeClass("error");
    $("#login > fieldset > .form_row > .input_container > input[name='password']").removeClass("error");
    $("#login > fieldset > .form_row > .input_container > #text_warning_login").removeClass("error");
});

//Skickar med input och kör funktion beroende på svaret
$('#login').on('submit', function (e) {
    e.preventDefault();
    $('.loader_container').addClass('is_visible');
    $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/login",
            data: {
                username: $("#login > fieldset > .form_row > .input_container > input[name='username']").val(),
                password: $("#login > fieldset > .form_row > .input_container > input[name='password']").val()
            }
        })
        //Om error lägger till röd boarder och varningstext 
        .done(function (valid) {
            if (valid == false) {
                $("#login > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
                $("#login > fieldset > .form_row > .input_container > input[name='password']").addClass("error");
                $("#login > fieldset > .form_row > .input_container > #text_warning_login").addClass("error");
            } else {
                location.replace("/");
            }
            $('.loader_container').removeClass('is_visible');
        });
});

$('#register').on('submit', function (e) {
    e.preventDefault();
    if (!$("#register > fieldset > .form_row > .input_container > input[name='username']").hasClass("error") && !$("#register > fieldset > .form_row > .input_container > input[name='email']").hasClass("error")) {
        $('.loader_container').addClass('is_visible');
        $.ajax({
                method: "POST",
                url: $SCRIPT_ROOT + "/register",
                data: {
                    firstname: $("#register > fieldset > .form_row > .input_container > input[name='firstname']").val(),
                    lastname: $("#register > fieldset > .form_row > .input_container > input[name='lastname']").val(),
                    username: $("#register > fieldset > .form_row > .input_container > input[name='username']").val(),
                    email: $("#register > fieldset > .form_row > .input_container > input[name='email']").val(),
                    password: $("#register > fieldset > .form_row > .input_container > input[name='password']").val(),
                    password2: $("#register > fieldset > .form_row > .input_container > input[name='password2']").val()
                }
            })
            .done(function (valid) {
                if (valid == true) {
                    location.replace("/");
                } else {

                }
                $('.loader_container').removeClass('is_visible');
            });
    }
});