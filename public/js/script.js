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

    if (tabName === 'about') {
        document.getElementById('about').style.display = 'block';
        document.getElementById('skills').style.display = 'block';
    } 
    else if (tabName === 'education') {
        document.getElementById('education').style.display = 'block';
    } 
    else if (tabName === 'work') {
        document.getElementById('work').style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const firstButton = document.querySelector('.buttonNav button');
    switchTab('about', firstButton);
});