// Audio context for generating sounds
let audioContext = null;
let audioContextReady = null;

// Initialize audio context on first user interaction
async function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error('Failed to create AudioContext:', e);
            return false;
        }
    }
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    return true;
}

function ensureAudioReady() {
    if (!audioContextReady) {
        audioContextReady = initAudio();
    }
    return audioContextReady;
}

// Play correct sound - bright friendly chime
async function playCorrectSound() {
    if (!await ensureAudioReady()) return;
    
    // Play two notes with a delay
    playNote(523.25, 659.25, 0, 0.4)      // C5 + E5
    playNote(523.25, 659.25, 0.15, 0.4)   // C5 + E5 (repeated)
}

function playNote(freq1, freq2, delay, duration) {
    const now = audioContext.currentTime + delay;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq1;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    // Harmonic
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    harmonic.frequency.value = freq2;
    harmonic.type = 'sine';
    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    harmonic.start(now);
    harmonic.stop(now + duration);
}

// Play incorrect sound - softer but friendly tone
async function playIncorrectSound() {
    if (!await ensureAudioReady()) return;
    
    // Play two notes with a delay
    playNoteIncorrect(392, 493.88, 0, 0.3)      // G4 + B4
    playNoteIncorrect(392, 493.88, 0.15, 0.3)  // G4 + B4 (repeated)
}

function playNoteIncorrect(freq1, freq2, delay, duration) {
    const now = audioContext.currentTime + delay;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = freq1;
    oscillator.type = 'triangle';
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    // Harmonic
    const harmonic = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
    
    harmonic.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
    
    harmonic.frequency.value = freq2;
    harmonic.type = 'triangle';
    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    harmonic.start(now);
    harmonic.stop(now + duration);
}

// Button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const correctBtn = document.getElementById('correctBtn')
    const incorrectBtn = document.getElementById('incorrectBtn')

    correctBtn.addEventListener('pointerdown', () => {
        correctBtn.classList.add('pressed')
    })

    correctBtn.addEventListener('pointerup', () => {
        correctBtn.classList.remove('pressed')
        playCorrectSound()
        triggerHaptic(30)
    })

    correctBtn.addEventListener('pointerleave', () => {
        correctBtn.classList.remove('pressed')
    })

    incorrectBtn.addEventListener('pointerdown', () => {
        incorrectBtn.classList.add('pressed')
    })

    incorrectBtn.addEventListener('pointerup', () => {
        incorrectBtn.classList.remove('pressed')
        playIncorrectSound()
        triggerHaptic(50)
    })

    incorrectBtn.addEventListener('pointerleave', () => {
        incorrectBtn.classList.remove('pressed')
    })
})

function triggerHaptic(duration) {
    if (navigator.vibrate) {
        navigator.vibrate(duration)
    }
}

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
