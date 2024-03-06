'use strict';

const buttonInquire = document.querySelector('.btn');
const formClose = document.querySelector('.form--close');
const headingSpan = document.querySelector(".heading--h1--span");

buttonInquire.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector('.form--container').classList.add('visible');
    document.querySelector('.overlay').classList.add('visible');
});

formClose.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector('.form--container').classList.remove('visible');
    document.querySelector('.overlay').classList.remove('visible');
});


// Define the two specific colors
const color1 = '#6f1d1b';
const color2 = '#184e77';

// Current color flag
let colorFlag = false;

// Function to toggle between the two colors
function toggleColor() {
    // Apply the color based on the current flag state
    headingSpan.style.color = colorFlag ? color1 : color2;
    // Toggle the flag for the next call
    colorFlag = !colorFlag;
}

setInterval(toggleColor, 500)

// Add event listener to headingSpan for the 'click' event
// headingSpan.addEventListener('click', applyRandomColor);
