function updateClockAndYear() {
    const now = new Date();

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = now.getFullYear();
    }

    const clockSpan = document.getElementById('liveClock');
    if (clockSpan) {
        clockSpan.textContent = now.toLocaleTimeString('sk-SK', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateClockAndYear();
    setInterval(updateClockAndYear, 1000);
});