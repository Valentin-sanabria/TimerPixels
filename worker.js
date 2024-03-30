let interval;

self.onmessage = function(event) {
    if (event.data.action === 'start') {
        let duration = event.data.duration;
        interval = setInterval(function() {
            duration--;
            if (duration <= 0) {
                clearInterval(interval);
            }
            self.postMessage(formatTime(duration));
        }, 1000);
    }
};

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
}
