var slideIndex = 1;
showSlides(slideIndex);

function plus_slides(n) {
  showSlides(slideIndex += n);
}

function current_slide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slide");
    var description = document.getElementsByClassName("post_text_description");
    var dots = document.getElementsByClassName("thumbnail");
    
    if (n > slides.length) {
        slideIndex = 1
    }

    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        description[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    description[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    }