window.LyricsPlayer = class {
    constructor() {  
        // Lyric Management
        this.currentIndex = 0;
        this.isPlaying = false;
        this.callFadeIn = true;

        // Dom Stuff
        this.playBtn = document.getElementById('playBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lyricsDisplay = document.getElementById('lyrics-container');
        this.progressBar = document.getElementById('progressBar');
        this.audio = document.getElementById('audio');


        this.frameNumber = 0
        // Time Management 
        this.startTimestamp = 0;
        this.pausedDuration = 0;
        this.lastUpdateTime = 0;

        this.bindEvents();
        this.reset();
    }

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.isPlaying) {
            this.audio.play();
            this.isPlaying = true;
            this.playBtn.textContent = '⏸ Pause';
            this.playBtn.classList.add('playing');

            // Get pause duration
            this.pausedDuration += performance.now() - this.lastUpdateTime;

            // Reset timing markers if starting from beginning
            if (this.audio.currentTime === 0) {
                this.startTimestamp = performance.now();
                this.pausedDuration = 0;
                this.currentIndex = 0;
            }
            
            this.startAnimation();
            this.startProgressBar();
        }
    }

    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            this.playBtn.textContent = '▶ Play';
            this.playBtn.classList.remove('playing');
            
            // Clear animation frames
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrameLyrics);
                cancelAnimationFrame(this.animationFrameProgressBar)
            }
            
            // Record how long we've been paused
            this.lastUpdateTime = performance.now()
        }
    }

    reset() {
        // Reset audio
        this.audio.pause();
        this.audio.currentTime = 0

        // Clear html elements
        this.lyricsDisplay.querySelectorAll('.lyric-line').forEach(el => el.remove());
        this.lyricsDisplay.querySelectorAll('.lyric-background').forEach(el => el.remove());
        this.callFadeIn = true;
        this.currentIndex = 0;
        this.playBtn.textContent = '▶ Play';
        this.playBtn.classList.remove('playing');
        this.progressBar.style.width = '0%';
    }

    startAnimation() {
        this.startAudio = true;
        this.displayLyric(this.currentIndex);
        this.startProgressBar();
    }

    displayLyric() {
        if (!this.isPlaying) return;
        
        const now = performance.now();
        this.lastUpdateTime = now;
        
        // Calculate actual elapsed time accounting for pauses
        const effectiveElapsed = now - this.startTimestamp - this.pausedDuration;
        const elapsedMs = effectiveElapsed;
        //console.log(this.timeLeft)
        // Update current index based on actual elapsed time
        this.updateCurrentIndex(elapsedMs);
        
        
        // Display current lyric
        const lyric = this.lyrics[this.currentIndex];
        this.timeLeft = lyric.duration;
        if (!lyric) return;
        
        let timeLeft = 0
        for (let i = 0; i < this.currentIndex + 1; i++) {
            timeLeft += this.lyrics[i].duration;
        }

        // Create and add new lyric line
        const lyricElement = document.createElement('div');
        lyricElement.className = 'lyric-line';
        lyricElement.textContent = lyric.text || ' ';

        // Clear main lyrics only
        if (this.callFadeIn) {
            this.lyricsDisplay.querySelectorAll('.lyric-line').forEach(el => el.remove());
            this.lyricsDisplay.appendChild(lyricElement);
            // Trigger fade in animation on at start
            setTimeout(() => {
                lyricElement.classList.add('active');
            }, 100);
            this.callFadeIn = false;
        }


        if (elapsedMs >= (timeLeft - 500) && this.isPlaying) {
            if (!this.lyricsDisplay.querySelector('.lyric-line').classList.contains('fadeout')) {
                this.lyricsDisplay.querySelector('.lyric-line').classList.add('fadeout')
            }
        }

        this.frameNumber++;
        this.animationFrameLyrics = requestAnimationFrame(() => this.displayLyric());
        
    }

    updateCurrentIndex(elapsedMs) {
        let cumulativeTime = 0;
        let newIndex = 0;
        
        for (let i = 0; i < this.lyrics.length; i++) {
            cumulativeTime += this.lyrics[i].duration;
            
            if (elapsedMs <= cumulativeTime) {
                newIndex = i;
                break;
            }
            if (i === this.lyrics.length - 1) {
                newIndex = i;
                break;
            }
        }
        if (newIndex !== this.currentIndex) {
            this.currentIndex = newIndex;
            this.callFadeIn = true;
        }
    }

    startProgressBar() {        
        const now = performance.now();
        this.lastUpdateTime = now;
        
        // Calculate actual elapsed time accounting for pauses
        const effectiveElapsed = now - this.startTimestamp - this.pausedDuration;
        const elapsedMs = effectiveElapsed;

        if (!this.isPlaying) return;
        const progress = Math.min((elapsedMs / this.totalDuration) * 100, 100);
        this.progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(this.progressInterval);
        }

        this.animationFrameProgressBar = requestAnimationFrame(() => this.startProgressBar());

    }

    onComplete() {
        this.isPlaying = false;
        this.playBtn.textContent = '✓ Complete';
        this.playBtn.classList.remove('playing');
        
        // Show completion message
        this.lyricsDisplay.innerHTML = `
            <div class="lyric-line active">Thank you for listening!</div>
        `;
        
        // Reset after a delay
        setTimeout(() => {
            this.reset();
        }, 3000);
    }
}

window.initLyricAnimation = function(title, artist, lyricData) {
    // Load title and artist name
    document.getElementById("song-title").textContent = title;
    document.getElementById("artist-name").textContent = artist;
    document.getElementById("audio").src = `./songs/${title}.mp3`;
    var lyricPlayer = new LyricsPlayer();
    // Load lyrics and the first time left duration
    lyricPlayer.lyrics = lyricData
    lyricPlayer.timeLeft = lyricPlayer.lyrics[0].duration;
    // For progress bar
    lyricPlayer.totalDuration = lyricPlayer.lyrics.reduce((sum, lyric) => sum + lyric.duration, 0);
}
