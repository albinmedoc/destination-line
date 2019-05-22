$(document).ready(function(){

    //Gör album klickbara
    var album_link = function(){
        $(".album > .info_circle").click(function(){
            var album_link = $(this).siblings(".album_link").attr("href");
            if(album_link){
                window.location = album_link;
            }
        });
    }
    album_link();

    var win = $(window);
    var get_albums = $("main>section.active>.album").length;
    var flow_type;
    var flow_element;
	// Each time the user scrolls
	win.scroll(function() {
		// End of the document reached?
		if ($(document).height() - win.height() == win.scrollTop()) {
            /* $('#loading').show(); */
            get_albums = $("main>section.active>.album").length;
            if($("#explore").hasClass("active")){
                flow_type = 1;
                flow_element = "#explore";
            }
            else if($("#following").hasClass("active")){
                flow_type = 2;
                flow_element = "#following";
            }
            $.ajax({
                url: $SCRIPT_ROOT + "/request/infinite_albums",
                method: "POST",
                data: {
                    get_albums: get_albums,
                    flow_type: flow_type
                }
            })
            .done(function(data) {
                if(data.get_albums[0]){
                    $(flow_element).append("<div class='album'><a class='album_link' href='album/"+data.get_albums[0][0]+"'></a><img src='/image/"+data.get_albums[0][5]+"' alt='"+data.get_albums[0][2]+" - "+data.get_albums[0][1]+"'><div class='info_circle'><h1 class='city flex_font'>"+data.get_albums[0][1]+"</h1><h2 class='country flex_font'>"+data.get_albums[0][2]+"</h2><i class='material-icons'>camera_alt</i><a href='profile/"+data.get_albums[0][6]+"' class='author'>"+data.get_albums[0][3]+ " " +data.get_albums[0][4]+"</a></div></div>");
                    album_link(); //Nya album som hämtas måste bli klickbara
                    get_albums = $("main>section.active>.album").length;
                    console.log(get_albums);
                }
            })
		}
	});
});