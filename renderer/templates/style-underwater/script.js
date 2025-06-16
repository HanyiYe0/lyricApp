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


        // Warp
        // Lyric text areaAdd commentMore actions
        this.pinch = -0.1
        this.blur = 0.3
        this.canvas = fx.canvas();
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = 2000;  // Adjust based on your needs
        this.textCanvas.height = 600; // Adjust based on your needs
        this.ctx = this.textCanvas.getContext('2d');
        // For moving effect
        this.cordY = 90
        // For bobbing effect
        this.scaleSize = 1;
        this.growing = true;
        // Draw text on the temporary canvas
        this.ctx.fillStyle = '#ffffff'; // White text
        this.ctx.font = 'bold 90px Arial'; // Customize font
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        //this.createTextCanvas('test', this.pinch)

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

        // Clear main lyrics only
        if (this.callFadeIn) {
            var lyricContainer = document.getElementById('lyrics-container');
            lyricContainer.innerHTML = '';
            // Reset pinch effect
            this.pinch = -1
            // Reset font size
            this.scaleSize = 1
            // Reset blur
            this.blur = 20
            // Reset coordinate y
            this.cordY = 400
            this.callFadeIn = false;
        }

        // Text moving effect
        if (this.cordY >= 90) {
            this.cordY = Math.max(this.cordY - 1, 90)
        }

        // Bluring Effect
        if (this.blur > 0) {
            this.blur = Math.max(this.blur - 1, 0)
        }
        // Pinch Warp effect
        if (this.pinch < 0) {
            var lyricContainer = document.getElementById('lyrics-container');
            lyricContainer.innerHTML = '';
            this.pinch = Math.min(this.pinch + 0.05, 0)
        } else {
            // Underwater bobbing effect
            if (this.growing) {
                this.scaleSize += 0.001;
                if (this.scaleSize >= 1.02) this.growing = false;
            } else {
                this.scaleSize -= 0.001;
                if (this.scaleSize <= 1) this.growing = true;
            }
        }
        this.createTextCanvas(this.lyrics[this.currentIndex].text, this.pinch, this.blur, this.scaleSize)

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
            this.frameNumber = 0;
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

    createTextCanvas(lyric, pinch, blur, scale) {
        // Clear and reset transformations
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply transformations from center
        this.ctx.translate(this.textCanvas.width / 2, this.textCanvas.height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-this.textCanvas.width / 2, -this.textCanvas.height / 2);
        
        // Draw text
        this.ctx.font = 'bold 90px Arial';
        this.ctx.fillText(lyric, this.textCanvas.width / 2, this.cordY);
        
        // Restore context
        this.ctx.restore();
        
        // Apply effects
        var texture = this.canvas.texture(this.textCanvas);
        this.canvas.draw(texture)
            .bulgePinch(this.textCanvas.width / 2, this.textCanvas.height / 2, 10000, pinch)
            .triangleBlur(blur)
            .update();
        
        // Clear previous canvas and append new one
        var container = document.getElementById('lyrics-container');
        container.innerHTML = '';
        container.appendChild(this.canvas);
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
