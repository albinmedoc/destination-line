// Börjar på första sliden och initerar bildspelet
var slide_index = 1;
show_slides(slide_index);

// Bläddrar mellan slides (n kan även vara negativt för bläddring bakåt)
function plus_slides(n) {
    show_slides(slide_index += n);
}

// Väljer bild med index n
function current_slide(n) {
    show_slides(slide_index = parseInt(n));
}

// Visar eller döljer thumbnails
$("#gallery_toggle").click(function () {
    $("#post_image_thumbnail_container").toggleClass("active");
    $(this).toggleClass("active");
});

// Bläddring i bildspel
function show_slides(n) {

    // Variabler för slides, bildtext och thumbnails
    var slides = document.getElementsByClassName("slide");
    var description = document.getElementsByClassName("post_text_description");
    var thumbnails = document.getElementsByClassName("thumbnail");

    // Vid sista sliden så börjar bildspelet om
    if (n > slides.length) {
        slide_index = 1;
    }

    // Byter slide
    if (n < 1) {
        slide_index = slides.length;
    }

    // Döljer alla slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        description[i].style.display = "none";
    }

    // Avmarkerar alla thumbnails
    for (i = 0; i < thumbnails.length; i++) {
        thumbnails[i].className = thumbnails[i].className.replace(" active", "");
    }

    // Visar slide och markerar thumbnail med rätt index
    slides[slide_index - 1].style.display = "block";
    description[slide_index - 1].style.display = "block";
    thumbnails[slide_index - 1].className += " active";
}