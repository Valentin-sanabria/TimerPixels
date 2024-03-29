let timers = JSON.parse(localStorage.getItem('timers')) || [];
let soundEnabled = true;

document.addEventListener('DOMContentLoaded', function() {
    loadTimers();
    updateSoundButton();
});

function createTimer() {
    const name = document.getElementById('timerName').value.trim();
    const durationInMinutes = parseInt(document.getElementById('timerDuration').value, 10); // Input in minutes
    
    if (!name || isNaN(durationInMinutes) || durationInMinutes <= 0) {
        alert("Please enter a valid name and duration.");
        return;
    }

    const durationInSeconds = durationInMinutes * 60; // Convert minutes to seconds
    const timer = { id: Date.now(), name, duration: durationInSeconds, active: true };
    timers.push(timer);
    saveTimers();
    addTimerToList(timer);
    document.getElementById('timerName').value = '';
    document.getElementById('timerDuration').value = '';
}

function addTimerToList(timer) {
    const timersList = document.getElementById('timersList');
    const li = document.createElement('li');
    li.setAttribute('id', timer.id);
    li.innerHTML = `
        <span>${timer.name}: <span class="time">${formatTime(timer.duration)}</span></span>
        <button class="timer-btn" onclick="toggleTimer(${timer.id}, true)">Start</button>
        <button class="timer-btn" onclick="removeTimer(${timer.id})">Delete</button>
    `;
    timersList.appendChild(li);
    if (timer.active) toggleTimer(timer.id, false);
}

function toggleTimer(id, reset) {
    const timer = timers.find(t => t.id === id);
    if (!timer) return;
    const timerElement = document.getElementById(id);
    const timeElement = timerElement.querySelector('.time');
    
    // Correct parsing of remaining time
    let duration;
    if (!reset) {
        const parts = timeElement.textContent.split(':');
        if (parts.length === 2) {
            duration = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        } else {
            duration = timer.duration; // Fallback to full duration if parsing fails
        }
    } else {
        duration = timer.duration; // Reset to full duration
    }

    if (timer.interval) {
        clearInterval(timer.interval);
        delete timer.interval;
        timerElement.classList.add('inactive');
        timerElement.style.backgroundColor = ''; // Revert to original color when timer is stopped or reset
        return;
    }

    timerElement.classList.remove('inactive');
    timerElement.style.backgroundColor = ''; // Ensure this is the desired default background color
    timer.interval = setInterval(() => {
        if (duration <= 0) {
            clearInterval(timer.interval);
            delete timer.interval;
            timeElement.textContent = "Time's up!";
            timerElement.style.backgroundColor = '#e6d7ff'; // Change color when timer finishes
            if (soundEnabled) document.getElementById('timerSound').play();
        } else {
            duration--;
            timeElement.textContent = formatTime(duration);
        }
    }, 1000);
}



function removeTimer(id) {
    clearInterval(timers.find(t => t.id === id).interval);
    timers = timers.filter(t => t.id !== id);
    saveTimers();
    document.getElementById(id).remove();
}

function saveTimers() {
    localStorage.setItem('timers', JSON.stringify(timers));
}

function loadTimers() {
    timers.forEach(timer => addTimerToList(timer));
}

// Adjusted to handle duration in seconds internally, but display in MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    updateSoundButton();
}

function updateSoundButton() {
    document.getElementById('soundControl').textContent = soundEnabled ? "Desactivar sonido" : "Activar sonido";
}
