//Kontrollerar om username redan finns
$("#search").keyup(function(){
    $.ajax({
        method: "POST",
        url: $SCRIPT_ROOT + "/request/search",
        data: {
            search_input: $(this).val()
        }
    })
    .done(function(search_results){
        if(search_results){
            $("#register > fieldset > .form_row > .input_container > input[name='username']").addClass("error");
        }else{
            $("#register > fieldset > .form_row > .input_container > input[name='username']").removeClass("error");
        }
    });
});