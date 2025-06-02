const lyricsTimestamp = `[00:21.31] 瀰漫的煙散不出留在房間
[00:26.25] 我在窗前捧著書本和茶點
[00:31.10] 我總是失望對於自己和明天
[00:35.48] 燈光下的微點又晃了我的眼
[00:41.26] I'm thinking about you 耳機播放著鼓點
[00:46.18] I can't live without you 保持我們初見時的新鮮
[00:51.04] I'm thinking about you 找個舒適的距間
[00:55.88] 可我的性格總讓我感覺虧欠
[01:00.22] 不確定的地點和一個待定的時間
[01:05.15] 我怎麼也會走進一場未知的淪陷?
[01:10.16] 一想到你就沒有任何不適的感覺
[01:15.01] 未來的每一天都多愛你一遍
[01:22.55] 現在是回憶陪我在作伴
[01:26.15] 重複的橋段裡面誰是病患
[01:32.43] 等待著忽然間一個笑容 別打擾了我的夢
[01:38.48] 'Cause I can't live without you
[01:40.64] I'm thinking about you 耳機播放著鼓點
[01:45.59] I can't live without you 保持我們初見時的新鮮
[01:50.52] I'm thinking about you 找個舒適的距間
[01:55.24] 可我的性格總讓我感覺虧欠
[01:59.58] 不確定的地點和一個待定的時間
[02:04.55] 我怎麼也會走進一場未知的淪陷?
[02:09.43] 一想到你就沒有任何不適的感覺
[02:14.53] 未來的每一天都多愛你一遍
[02:20.18] I'm thinking about you 耳機播放著鼓點
[02:25.15] I can't live without you 保持我們初見時的新鮮
[02:30.05] I'm thinking about you 找個舒適的距間
[02:34.98] 可我的性格總讓我感覺虧欠
[02:39.12] 不確定的地點和一個待定的時間
[02:44.21] 我怎麼也會走進一場未知的淪陷?
[02:49.11] 一想到你就沒有任何不適的感覺
[02:54.04] 未來的每一天都多愛你一遍
[02:59.27] `
var songLength = 183

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