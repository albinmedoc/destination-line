window.onload = function() {
    $(".flex_font").each(function(){
        if($(this).text().length > 9 && $(this).text().length < 15){
            if($(this).hasClass("country")){
                $(this).css("font-size", "3.5vw");
            }else if($(this).hasClass("city")){
                $(this).css("font-size", "7.2vw");
            }
        }else if($(this).text().length >= 15 && $(this).text().length < 20){
            if($(this).hasClass("country")){
                $(this).css("font-size", "3.2vw");
            }else if($(this).hasClass("city")){
                $(this).css("font-size", "5vw");
            }
        }
        else if($(this).text().length >= 20 && $(this).text().length < 25){
            if($(this).hasClass("country")){
                $(this).css("font-size", "2.9vw");
            }else if($(this).hasClass("city")){
                $(this).css("font-size", "4.1vw");
            }
        }
        else if($(this).text().length >= 25 && $(this).text().length < 30){
            if($(this).hasClass("country")){
                $(this).css("font-size", "2.7vw");
            }else if($(this).hasClass("city")){
                $(this).css("font-size", "3.1vw");
            }
        }
        else if($(this).text().length >= 30 && $(this).text().length < 35){
            if($(this).hasClass("country")){
                $(this).css("font-size", "2.5vw");
            }else if($(this).hasClass("city")){
                $(this).css("font-size", "2.2vw");
            }
        }
    });
};