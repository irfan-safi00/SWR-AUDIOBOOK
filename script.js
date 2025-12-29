const books = [
    { title: "Crime and Punishment", file: "audio/crime.mp3", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300" },
    { title: "The Idiot", file: "audio/idiot.mp3", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300" },
    { title: "Brothers Karamazov", file: "audio/brothers.mp3", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300" },
    { title: "Notes from Underground", file: "audio/underground.mp3", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300" }
];

let currentIdx = 0;
const audio = document.getElementById('audio-engine');

function init() {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = books.map((b, i) => `
        <div class="book-card" onclick="selectBook(${i})">
            <img src="${b.img}">
            <h4 style="font-size: 0.9rem;">${b.title}</h4>
        </div>
    `).join('');
    selectBook(0, false);
}

function selectBook(i, play = true) {
    currentIdx = i;
    const b = books[i];
    document.getElementById('p-title').innerText = b.title;
    document.getElementById('p-img').src = b.img;
    audio.src = b.file;
    if(play) togglePlay();
    
    // Track Progress
    let log = JSON.parse(localStorage.getItem('study_log') || '[]');
    if(!log.includes(b.title)) log.push(b.title);
    localStorage.setItem('study_log', JSON.stringify(log));
    updateStats();
}

function togglePlay() {
    const btn = document.getElementById('play-btn');
    if(audio.paused) {
        audio.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

audio.ontimeupdate = () => {
    const fill = document.getElementById('progress-fill');
    fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    document.getElementById('c-time').innerText = fmt(audio.currentTime);
    if(audio.duration) document.getElementById('t-time').innerText = fmt(audio.duration);
};

function fmt(s) {
    let m = Math.floor(s/60); let r = Math.floor(s%60);
    return `${m}:${r < 10 ? '0'+r : r}`;
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-'+id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function updateStats() {
    const log = JSON.parse(localStorage.getItem('study_log') || '[]');
    document.getElementById('books-completed').innerText = log.length;
}

window.onload = init;
