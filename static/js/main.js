
    $("#login, #register").mousedown(function(e){
        if(e.target.id == "login" || e.target.id == "register"){
            location.hash = '';
        }
    });
    $(".confirm_cookies").click(function(e){
        $(this).closest('div').remove();
    });