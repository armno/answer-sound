// Audio context for generating sounds
let audioContext = null;

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Failed to create AudioContext:', e);
            return false;
        }
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return true;
}

// Play correct sound - pleasant chime
function playCorrectSound() {
    if (!initAudio()) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // C5 note (523.25 Hz) - pleasant chime
    oscillator.frequency.value = 523.25;
    oscillator.type = 'sine';
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
    
    // Add a harmonic for richness
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    harmonic.frequency.value = 1046.5; // C6
    harmonic.type = 'sine';
    harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    harmonic.start();
    harmonic.stop(audioContext.currentTime + 0.3);
}

// Play incorrect sound - lower buzz
function playIncorrectSound() {
    if (!initAudio()) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // G3 note (196 Hz) - lower buzz
    oscillator.frequency.value = 196;
    oscillator.type = 'sawtooth';
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Add dissonance for "incorrect" feel
    const dissonance = audioContext.createOscillator();
    const dissonanceGain = audioContext.createGain();
    
    dissonance.connect(dissonanceGain);
    dissonanceGain.connect(audioContext.destination);
    
    dissonance.frequency.value = 185; // F#3 - creates dissonance
    dissonance.type = 'sawtooth';
    dissonanceGain.gain.setValueAtTime(0, audioContext.currentTime);
    dissonanceGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
    dissonanceGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    dissonance.start();
    dissonance.stop(audioContext.currentTime + 0.5);
}

// Button click handlers
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('correctBtn').addEventListener('click', () => {
        playCorrectSound()
    })

    document.getElementById('incorrectBtn').addEventListener('click', () => {
        playIncorrectSound()
    })
})

// Prevent double-tap zoom on mobile
let lastTouchEnd = 0
document.addEventListener('touchend', (e) => {
    const now = Date.now()
    if (now - lastTouchEnd <= 300) {
        e.preventDefault()
    }
    lastTouchEnd = now
}, false)

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault()
    }
}, { passive: false })
