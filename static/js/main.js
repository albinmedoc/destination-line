
    $("#login, #register").mousedown(function(e){
        if(e.target.id == "login" || e.target.id == "register"){
            location.hash = '';
        }
    });