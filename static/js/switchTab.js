function switchTab(tabName, buttonElement) {
    
    const allButtons = document.querySelectorAll('.buttonNav button');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    const allTabs = document.querySelectorAll('.tabContent');
    allTabs.forEach(tab => {
        tab.style.display = 'none';
    });

    if (tabName === 'aboutSectionId') {
        document.getElementById('aboutSectionId').style.display = 'block';
        document.getElementById('skillsSectionId').style.display = 'block';
    } 
    else if (tabName === 'educationSectionId') {
        document.getElementById('educationSectionId').style.display = 'block';
    } 
    else if (tabName === 'workSectionId') {
        document.getElementById('workSectionId').style.display = 'block';
    }

    const buttonTop = buttonElement.getBoundingClientRect().top + window.scrollY;
    const offset = 60;
    window.scrollTo({
        top: buttonTop - offset,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const firstButton = document.querySelector('.buttonNav button');
    switchTab('about', firstButton);
});