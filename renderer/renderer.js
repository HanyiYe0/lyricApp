const switcher = document.getElementById('templateSwitcher');
const placeholder = document.getElementById('lyricPlaceholder');
const select = document.getElementById("songSelector");


// 2) When user picks a song:
select.addEventListener("change", async (evt) => {
    const songFile = evt.target.value; // e.g. "song2.json"
    try {
      songData = await loadSong(songFile);
      // songData.lyrics is now an array—pass it into your template’s init function:
      switchTemplate(switcher.value, songData);
    } catch (e) {
      console.error("Failed to load lyrics:", e);
    }
  });

async function loadSong(songFile) {
  // songFile might be "song1.json" or "song2.json"
  const res = await fetch(`data/${songFile}`);
  if (!res.ok) throw new Error("Couldn’t load lyrics");
  return await res.json();
}

async function switchTemplate(styleName, songData) {
  // Remove LyricsPlayer class
  if (typeof window.LyricsPlayer !== 'undefined') {
    delete window.LyricsPlayer;
  }
  
  // Remove the init function
  if (typeof window.initLyricAnimation !== 'undefined') {
    delete window.initLyricAnimation;
  }
  // 1. Fetch and inject HTML
  const html = await fetch(`./templates/${styleName}/template.html`)
                     .then(r => r.text());
  placeholder.innerHTML = html;
  
  // 2. Load CSS
  loadStyleCss(styleName);
  
  // 3. Load JS and initialize (assuming each script exposes a known init function)
  loadStyleJs(styleName, () => {
    // Convention: each style’s script defines window.initLyricAnimation
    if (typeof window.initLyricAnimation === 'function') {
      window.initLyricAnimation(songData.title, songData.artist, songData.lyrics);
    }
  });
}

// On first load, pick the default (e.g. “style-wave”)
document.addEventListener('DOMContentLoaded', async () => {
  console.log(select.value)
  var songData = await loadSong(select.value);
  // Delete LyricsPlayer if already existing
  switchTemplate(switcher.value, songData);
});

// When user picks a new one:
switcher.addEventListener('change', () => {
  switchTemplate(switcher.value, songData);
});

function loadStyleCss(styleName) {
  // Remove old style tag if it exists
  const existingLink = document.getElementById('dynamicStyle');
  if (existingLink) existingLink.remove();
  
  // Inject new <link>
  const link = document.createElement('link');
  link.id = 'dynamicStyle';
  link.rel = 'stylesheet';
  link.href = `./templates/${styleName}/style.css`;
  document.head.appendChild(link);
}

function loadStyleJs(styleName, onLoadCallback) {
  const existingScript = document.getElementById('dynamicScript');
  if (existingScript) existingScript.remove();
  
  const script = document.createElement('script');
  script.id = 'dynamicScript';
  script.src = `./templates/${styleName}/script.js`;
  // If your script exports a function like initLyricAnimation(...),
  // you can call it in onload.
  script.onload = onLoadCallback;
  document.body.appendChild(script);
}
