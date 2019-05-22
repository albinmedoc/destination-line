var slide_index = 1;
show_slides(slide_index);

function plus_slides(n) {
  show_slides(slide_index += n);
}

function current_slide(n) {
  show_slides(slide_index = n);
}

$("#gallery_toggle").click(function(){
    $("#post_image_thumbnail_container").toggleClass("active");
    $(this).toggleClass("active");
});

function show_slides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    var description = document.getElementsByClassName("post_text_description");
    var dots = document.getElementsByClassName("thumbnail");
    
    if (n > slides.length) {
        slide_index = 1
    }

    if (n < 1) {
        slide_index = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        description[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slide_index - 1].style.display = "block";
    description[slide_index - 1].style.display = "block";
    dots[slide_index - 1].className += " active";
}