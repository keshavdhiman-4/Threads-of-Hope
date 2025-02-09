let slideIndex = 0;
let slideInterval;

// Function to show the slides and manage automatic slideshow
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function startSlideShow() {
    showSlides();
    slideInterval = setInterval(showSlides, 4000);
}

// Function to handle dot clicks
function currentSlide(n) {
    clearInterval(slideInterval);
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slideIndex = n;
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";

    slideInterval = setInterval(showSlides, 4000);
}

document.addEventListener('DOMContentLoaded', function () {
    const dots = document.querySelectorAll('.dot');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            currentSlide(index + 1);
        });
    });

    startSlideShow();
});

// Function toggle between login and register forms
function toggleForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}