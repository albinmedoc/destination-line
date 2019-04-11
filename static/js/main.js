window.onload = function() {
    $("#login, #register").mousedown(function(e){
        if(e.target.id == "login" || e.target.id == "register"){
            location.hash = '';
        }
    });
    $(".close_flash").click(function(e){
        $(this).closest('div').remove();
    });
}