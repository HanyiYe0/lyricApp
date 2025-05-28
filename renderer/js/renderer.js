class LyricsPlayer {
    constructor() {
        this.lyrics = [
            { text: ' ', duration: 3760 },
            { text: '(Ooh, ooh)', duration: 5480 },
            { text: 'I, I just woke up from a dream', duration: 6370 },
            { text: 'Where you and I had to say goodbye', duration: 4960 },
            { text: "And I don't know what it all means", duration: 3950 },
            { text: 'But since I survived, I realized', duration: 4810 },
            { text: "Wherever you go, that's where I'll follow", duration: 4710 },
            { text: "Nobody's promised tomorrow", duration: 4400 },
            { text: "So, I'ma love you every night like it's the last night", duration: 4070 },
            { text: "Like it's the last night", duration: 2240 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 9340 },
            { text: 'If the party was over and our time on earth was through', duration: 8840 },
            { text: "I'd wanna hold you just for a while", duration: 5340 },
            { text: 'And die with a smile', duration: 4090 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 8630 },
            { text: '(Ooh, ooh)', duration: 4330 },
            { text: 'Ooh, lost, lost in the words that we scream', duration: 7950 },
            { text: "I don't even wanna do this anymore", duration: 4610 },
            { text: "'Cause you already know what you mean to me", duration: 3470 },
            { text: "And our love's the only war worth fighting for", duration: 5720 },
            { text: "Wherever you go, that's where I'll follow", duration: 4430 },
            { text: "Nobody's promised tomorrow", duration: 4370 },
            { text: "So, I'ma love you every night like it's the last night", duration: 3960 },
            { text: "Like it's the last night", duration: 2370 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 8970 },
            { text: 'If the party was over and our time on earth was through', duration: 9180 },
            { text: "I'd wanna hold you just for a while", duration: 5280 },
            { text: 'And die with a smile', duration: 4170 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 8860 },
            { text: 'Right next to you', duration: 4560 },
            { text: 'Next to you', duration: 4450 },
            { text: 'Right next to you', duration: 4040 },
            { text: 'Oh', duration: 2480 },
            { text: '', duration: 16570 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 9130 },
            { text: 'If the party was over and our time on earth was through', duration: 8900 },
            { text: "I'd wanna hold you just for a while", duration: 4990 },
            { text: 'And die with a smile', duration: 4320 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 8940 },
            { text: "If the world was ending, I'd wanna be next to you", duration: 9870 },
            { text: '(Ooh, ooh)', duration: 2600 },
            { text: "I'd wanna be next to you", duration: 3690 },
            { text: '', duration: 7800 }
        ];

        this.currentIndex = 0;
        this.isPlaying = false;
        this.totalDuration = this.lyrics.reduce((sum, lyric) => sum + lyric.duration, 0);
        this.elapsedTime = 0;
        
        this.playBtn = document.getElementById('playBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lyricsDisplay = document.getElementById('lyrics-container');
        this.lyricBackground = document.getElementById('lyricBackground');
        this.progressBar = document.getElementById('progressBar');
        this.audio = document.getElementById('audio');

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
        this.audio.play()
        this.isPlaying = true;
        this.playBtn.textContent = '⏸ Pause';
        this.playBtn.classList.add('playing');
        this.startAnimation();
    }

    pause() {
        this.audio.pause()
        this.isPlaying = false;
        this.playBtn.textContent = '▶ Play';
        this.playBtn.classList.remove('playing');
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    reset() {
        // Reset audio
        this.audio.pause();
        this.audio.currentTime = 0

        this.currentIndex = 0;
        this.elapsedTime = 0;
        this.playBtn.textContent = '▶ Play';
        this.playBtn.classList.remove('playing');
        this.progressBar.style.width = '0%';
    }

    startAnimation() {
        this.displayLyric(this.currentIndex);
        this.startProgressBar();
    }

    displayLyric(index) {
        if (!this.isPlaying || index >= this.lyrics.length) {
            if (index >= this.lyrics.length) {
                this.onComplete();
            }
            return;
        }

        const lyric = this.lyrics[index];
        
        // Clear main lyrics only
        this.lyricsDisplay.querySelectorAll('.lyric-line').forEach(el => el.remove());
        this.lyricsDisplay.querySelectorAll('.lyric-background').forEach(el => el.remove());

        // Create and add new lyric line
        const lyricElement = document.createElement('div');
        const lyricBackgroundElement = document.createElement('div');
        lyricElement.className = 'lyric-line';
        lyricElement.textContent = lyric.text || ' ';
        
        // Background text
        lyricBackgroundElement.className = 'lyric-background';
        var backgroundText = lyric.text.split(" ").pop()
        
        lyricBackgroundElement.textContent = backgroundText;
        this.lyricsDisplay.appendChild(lyricBackgroundElement);
        this.lyricsDisplay.appendChild(lyricElement);
        

        // Trigger animation
        setTimeout(() => {
            lyricElement.classList.add('active');
            lyricBackgroundElement.classList.add('active');
        }, 100);

        // Schedule next lyric
        this.currentTimeout = setTimeout(() => {
            if (this.isPlaying) {
                lyricElement.classList.add('fadeout');
                lyricBackgroundElement.classList.add('fadeout');
                setTimeout(() => {
                    this.currentIndex++;
                    this.displayLyric(this.currentIndex);
                }, 500);
            }
        }, lyric.duration - 500);
    }
    startProgressBar() {
        const startTime = Date.now() - this.elapsedTime;
        
        this.progressInterval = setInterval(() => {
            if (!this.isPlaying) return;
            
            this.elapsedTime = Date.now() - startTime;
            const progress = Math.min((this.elapsedTime / this.totalDuration) * 100, 100);
            this.progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(this.progressInterval);
            }
        }, 100);
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

// Initialize the lyrics player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LyricsPlayer();
});

$('body').ripples({
  resolution: 1024,    // internal WebGL texture size
  dropRadius: 40,     // radius of each drop (px)
  perturbance: 0.04,   // how “wobbly” the surface is
  interactive: false
});

const interval = setInterval(() => {
   $('body').ripples('drop', 20, 500, 20, 0.4);
    $('body').ripples('drop', 1980, 500, 20, 0.4);
 }, 5000);