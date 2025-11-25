
const song1 = {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": 233,
    "genre": "Pop"
}

// clone
const song2 = Object.assign({}, song1);

const { title, duration } = song2;


for (const key in song1) {
    console.log(`${key}: ${song1[key]}`);
}
console.log('------------------');


const playlist = {
    "playlistName": "My Favorites",
    "createdBy": "John",
    "songs": [
        {
            "title": "Shape of You",
            "artist": "Ed Sheeran",
            "duration": 233
        },
        {
            "title": "Blinding Lights",
            "artist": "The Weeknd",
            "duration": 200
        }
    ]
}

let addSong = {
    "title": "Levitating",
    "artist": "Dua Lipa",
    "duration": 203
};
playlist.songs.push(addSong);


// Iterate and print song titles
playlist.songs.forEach(song => {
    console.log(`Title: ${song.title}, Artist: ${song.artist}`);
});
console.log('------------------');


// JSON stringify
const jsonOutput = JSON.stringify(playlist);
console.log(jsonOutput);
console.log('------------------');

// JSON parse
const jsonString = '{"playlistName":"Top Hits","songs":[{"title":"Shape of You","artist":"Ed Sheeran"}]}';
const playlistObj = JSON.parse(jsonString);
console.log(playlistObj.songs[0].title); // Shape of You

// local storage
localStorage.setItem('playlist', jsonOutput);
let storageTxt = localStorage.getItem('playlist');
let playlist3 = JSON.parse(storageTxt);