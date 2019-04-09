$("#upload_btn").click(function(){
    $("#upload").trigger("click");
});

Sortable.create(test, {
    animation: 500,
    draggable: ".post",
    scroll: true,
	scrollSensitivity: 50
  });