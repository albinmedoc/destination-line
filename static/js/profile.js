window.onload = function () {
    $("i.follow").click(function(){
        var target_name = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
        $.ajax({
            method: "POST",
            url: $SCRIPT_ROOT + "/request/follow",
            data: {
                target_name: target_name
            }
        })
        .done(function(){
            alert("Du följer nu " + target_name);
        });
    });
}