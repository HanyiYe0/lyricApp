const lyricsTimestamp = `[00:03.76] (Ooh, ooh)
[00:09.24] I, I just woke up from a dream
[00:15.61] Where you and I had to say goodbye
[00:20.57] And I don't know what it all means
[00:24.52] But since I survived, I realized
[00:29.33] Wherever you go, that's where I'll follow
[00:34.04] Nobody's promised tomorrow
[00:38.44] So, I'ma love you every night like it's the last night
[00:42.51] Like it's the last night
[00:44.75] If the world was ending, I'd wanna be next to you
[00:54.09] If the party was over and our time on earth was through
[01:02.93] I'd wanna hold you just for a while
[01:08.27] And die with a smile
[01:12.36] If the world was ending, I'd wanna be next to you
[01:20.99] (Ooh, ooh)
[01:25.32] Ooh, lost, lost in the words that we scream
[01:33.27] I don't even wanna do this anymore
[01:37.88] 'Cause you already know what you mean to me
[01:41.35] And our love's the only war worth fighting for
[01:47.07] Wherever you go, that's where I'll follow
[01:51.50] Nobody's promised tomorrow
[01:55.87] So, I'ma love you every night like it's the last night
[01:59.83] Like it's the last night
[02:02.20] If the world was ending, I'd wanna be next to you
[02:11.17] If the party was over and our time on earth was through
[02:20.35] I'd wanna hold you just for a while
[02:25.63] And die with a smile
[02:29.80] If the world was ending, I'd wanna be next to you
[02:38.66] Right next to you
[02:43.22] Next to you
[02:47.67] Right next to you
[02:51.71] Oh
[02:54.19] 
[03:10.76] If the world was ending, I'd wanna be next to you
[03:19.89] If the party was over and our time on earth was through
[03:28.79] I'd wanna hold you just for a while
[03:33.78] And die with a smile
[03:38.10] If the world was ending, I'd wanna be next to you
[03:47.04] If the world was ending, I'd wanna be next to you
[03:56.91] (Ooh, ooh)
[03:59.51] I'd wanna be next to you
[04:03.20] `
var songLength = 251

function generateLyrics(lyricsTimestamp) {
    var output = []
    var listOfLyrics = lyricsTimestamp.split('\n')
    //console.log(listOfLyrics)
    for (var i = 0; i < listOfLyrics.length; i++) {
        var [timestamp, lyric] = listOfLyrics[i].split(/(?<=\])\s+/);
        var prevSeconds;
        var prevLyric;
        //console.log(timestamp)
        //console.log(lyric)
        seconds = parseInt(timestamp.substring(1, 3)) * 60 + parseFloat(timestamp.substring(4, 9))
        if (output.length === 0) {
            dictInput = { text: '~', duration: Math.round(seconds * 1000)}
            prevSeconds = seconds
            prevLyric = lyric
            //dictInput = {text: lyric, duration: Math.round(seconds * 1000)}
        }
        else {
            lyricDuration = Math.round(seconds * 1000 - prevSeconds * 1000)
            //console.log(lyricDuration)
            dictInput = {text: prevLyric, duration: lyricDuration}
            prevSeconds = seconds
            prevLyric = lyric
        }
        output.push(dictInput)

        // Last line, play last lyric until end of song
        if (i === listOfLyrics.length - 1) {
            lyricDuration = Math.round(songLength * 1000 - prevSeconds * 1000)
            output.push({text: lyric, duration: lyricDuration})
        }
    }
    return output
}

console.log(generateLyrics(lyricsTimestamp))
//generateLyrics(lyricsTimestamp)