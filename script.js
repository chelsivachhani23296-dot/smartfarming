// Example: alert when section clicked
document.querySelectorAll('section').forEach(sec => {
    sec.addEventListener('click', () => {
        alert('You clicked on: ' + sec.querySelector('h2').innerText);
    });
});