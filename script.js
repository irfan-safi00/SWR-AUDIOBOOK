/**
 * SYLLABUS WITH ROHIT - AUDIO ENGINE
 * Features: Audio Control, Search Filter, LocalStorage Progress, Speed Control
 */

// 1. DATA CONFIGURATION (Update this array with your actual file paths)
const tracks = [
    { 
        id: 0,
        title: "01. Introduction to the Syllabus", 
        file: "audio/intro.mp3", 
        img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500",
        duration: "05:20"
    },
    { 
        id: 1,
        title: "02. History: Ancient Civilizations", 
        file: "audio/history-ch1.mp3", 
        img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500",
        duration: "12:45"
    },
    { 
        id: 2,
        title: "03. Mathematics: Algebraic Basics", 
        file: "audio/math-ch1.mp3", 
        img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500",
        duration: "08:15"
    },
    { 
        id: 3,
        title: "04. Science: The Cell Theory", 
        file: "audio/science-ch1.mp3", 
        img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500",
        duration: "15:30"
    }
];

// 2. ELEMENT SELECTORS
const audio = document.getElementById('main-audio-engine');
const playPauseBtn = document.getElementById('play-pause');
const progressArea = document.getElementById('progress-area');
const progressFill = document.getElementById('progress-fill');
const playlistContainer = document.getElementById('playlist-list');
const searchInput = document.getElementById('chapterSearch');
const speedSelect = document.getElementById('speed-control');

let currentTrackIndex = localStorage.getItem('rohit_last_track') || 0;
let isPlaying = false;

// 3. INITIALIZATION
function init() {
    renderPlaylist(tracks);
    loadTrack(currentTrackIndex);
    
    // Restore playback position if it exists
    const savedTime = localStorage.getItem('rohit_last_time');
    if (savedTime) audio.currentTime = savedTime;
}

// 4. RENDER PLAYLIST (With Search Logic)
function renderPlaylist(trackList) {
    playlistContainer.innerHTML = "";
    trackList.forEach((track) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${track.id == currentTrackIndex ? 'active' : ''}`;
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <i class="fas ${track.id == currentTrackIndex && isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}"></i>
                <span>${track.title}</span>
            </div>
            <small>${track.duration}</small>
        `;
        li.onclick = () => {
            currentTrackIndex = track.id;
            loadTrack(currentTrackIndex);
            playAudio();
        };
        playlistContainer.appendChild(li);
    });
}

// 5. CORE AUDIO LOGIC
function loadTrack(index) {
    const track = tracks[index];
    document.getElementById('track-title').innerText = track.title;
    document.getElementById('track-img').src = track.img;
    audio.src = track.file;
    
    localStorage.setItem('rohit_last_track', index);
    renderPlaylist(tracks);
}

function togglePlay() {
    isPlaying ? pauseAudio() : playAudio();
}

function playAudio() {
    isPlaying = true;
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    renderPlaylist(tracks);
}

function pauseAudio() {
    isPlaying = false;
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    renderPlaylist(tracks);
}

// 6. EVENT LISTENERS
playPauseBtn.addEventListener('click', togglePlay);

// Update Progress Bar
audio.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        document.getElementById('current-time').innerText = formatTime(currentTime);
        document.getElementById('duration-time').innerText = formatTime(duration);
        
        // Save progress every 5 seconds locally
        if (Math.floor(currentTime) % 5 === 0) {
            localStorage.setItem('rohit_last_time', currentTime);
        }
    }
});

// Click to Seek
progressArea.addEventListener('click', (e) => {
    const width = progressArea.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// Navigation
document.getElementById('next').onclick = () => {
    currentTrackIndex = (parseInt(currentTrackIndex) + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playAudio();
};

document.getElementById('prev').onclick = () => {
    currentTrackIndex = (parseInt(currentTrackIndex) - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playAudio();
};

// Search Filter Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = tracks.filter(t => t.title.toLowerCase().includes(term));
    renderPlaylist(filtered);
});

// Speed Control
speedSelect.addEventListener('change', () => {
    audio.playbackRate = parseFloat(speedSelect.value);
});

// Auto-play Next
audio.addEventListener('ended', () => {
    document.getElementById('next').click();
});

// Format Time Utility
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Run on load
window.onload = init;
