var lyrics = [
  { text: ' ~ ', duration: 3760 },
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
  { text: '~', duration: 16570 },
  { text: "If the world was ending, I'd wanna be next to you", duration: 9130 },
  { text: 'If the party was over and our time on earth was through', duration: 8900 },
  { text: "I'd wanna hold you just for a while", duration: 4990 },
  { text: 'And die with a smile', duration: 4320 },
  { text: "If the world was ending, I'd wanna be next to you", duration: 8940 },
  { text: "If the world was ending, I'd wanna be next to you", duration: 9870 },
  { text: '(Ooh, ooh)', duration: 2600 },
  { text: "I'd wanna be next to you", duration: 3690 },
  { text: '~', duration: 7800 }
];


const switcher = document.getElementById('templateSwitcher');
const placeholder = document.getElementById('lyricPlaceholder');

async function switchTemplate(styleName) {
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
      window.initLyricAnimation(lyrics);
    }
  });
}

// On first load, pick the default (e.g. “style-wave”)
document.addEventListener('DOMContentLoaded', () => {
  switchTemplate(switcher.value);
});

// When user picks a new one:
switcher.addEventListener('change', () => {
  switchTemplate(switcher.value);
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
