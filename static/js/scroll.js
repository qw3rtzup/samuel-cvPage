const topDiv = document.querySelector('#topDivId');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) { 
    topDiv.classList.add('scrolled');
  } else {
    topDiv.classList.remove('scrolled');
  }
});