const musicData = [
    {
        songName: "Bohemian Rhapsody",
        artist: "Queen",
        duration: "5:55",
        date: "1975",
        youtubeLink: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
        thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg"
    },
    {
        songName: "Stairway to Heaven",
        artist: "Led Zeppelin",
        duration: "8:02",
        date: "1971",
        youtubeLink: "https://www.youtube.com/watch?v=qHFxncb1gRY",
        thumbnail: "https://i.ytimg.com/vi/qHFxncb1gRY/hqdefault.jpg"
    },
    {
        songName: "Hotel California",
        artist: "Eagles",
        duration: "6:30",
        date: "1976",
        youtubeLink: "https://www.youtube.com/watch?v=5vUDmFjD6gA",
        thumbnail: "https://i.ytimg.com/vi/5vUDmFjD6gA/hqdefault.jpg"
    },
    {
        songName: "Smells Like Teen Spirit",
        artist: "Nirvana",
        duration: "5:01",
        date: "1991",
        youtubeLink: "https://www.youtube.com/watch?v=hTWKbfoikeg",
        thumbnail: "https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg"
    },
    {
        songName: "Billie Jean",
        artist: "Michael Jackson",
        duration: "4:54",
        date: "1982",
        youtubeLink: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
        thumbnail: "https://i.ytimg.com/vi/Zi_XLOBDo_Y/hqdefault.jpg"
    }
];

const tableBody = document.getElementById("table-body");

musicData.forEach(song => {
    const row = document.createElement("tr");

    const songNameCell = document.createElement("td");
    songNameCell.textContent = song.songName;
    row.appendChild(songNameCell);

    const artistCell = document.createElement("td");
    artistCell.textContent = song.artist;
    row.appendChild(artistCell);

    const durationCell = document.createElement("td");
    durationCell.textContent = song.duration;
    row.appendChild(durationCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = song.date;
    row.appendChild(dateCell);

    const linkCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = song.youtubeLink;
    link.target = "_blank";
    const thumbnail = document.createElement("img");
    thumbnail.src = song.thumbnail;
    thumbnail.alt = song.songName;
    link.appendChild(thumbnail);
    linkCell.appendChild(link);
    row.appendChild(linkCell);

    tableBody.appendChild(row);
});