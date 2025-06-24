window.LyricsPlayer = class {
    constructor() {  
        // Lyric Management
        this.currentIndex = 0;
        this.isPlaying = false;
        this.callFadeIn = true;
        this.currentWords = [];

        // Dom Stuff
        this.playBtn = document.getElementById('playBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lyricsDisplay = document.getElementById('lyrics-container');
        this.lyricBackground = document.getElementById('lyricBackground');
        this.progressBar = document.getElementById('progressBar');
        this.audio = document.getElementById('audio');

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

            // Split the lyric line into the words
            this.currentWords = this.splitWords(this.lyrics[this.currentIndex].text)
            console.log(this.currentWords)
        }


        if (elapsedMs >= (timeLeft - 500) && this.isPlaying) {
            if (!this.lyricsDisplay.querySelector('.lyric-line').classList.contains('fadeout')) {
                this.lyricsDisplay.querySelector('.lyric-line').classList.add('fadeout')
            }
        }

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
        this.reset();
    }

    splitWords(lyricLine) {
        if (!lyricLine || !lyricLine.trim()) {
            return [];
        }
        
        lyricLine = lyricLine.trim();
        
        let pattern;
        pattern = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\uf900-\ufaff]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\p{L}\p{N}\p{P}\p{S}]+/gu;
        
        let words = lyricLine.match(pattern) || [];
        // Apply filters
        words = words.filter(word => word.trim() && word.length >= 1);
        
        return words;
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

function isChineseChar(char) {
    const cp = char.codePointAt(0);
    return (
        (0x4E00 <= cp && cp <= 0x9FFF) ||
        (0x3400 <= cp && cp <= 0x4DBF) ||
        (0x20000 <= cp && cp <= 0x2A6DF) ||
        (0x2A700 <= cp && cp <= 0x2B73F) ||
        (0x2B740 <= cp && cp <= 0x2B81F) ||
        (0x2B820 <= cp && cp <= 0x2CEAF) ||
        (0x2CEB0 <= cp && cp <= 0x2EBEF) ||
        (0x30000 <= cp && cp <= 0x3134F) ||
        (0x31350 <= cp && cp <= 0x323AF) ||
        (0xF900 <= cp && cp <= 0xFAFF)
    );
}