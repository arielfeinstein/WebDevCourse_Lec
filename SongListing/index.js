// Get references to DOM elements
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

// Load existing songs from localStorage or initialize an empty array
let songs = [];
try {
    const parsed = JSON.parse(localStorage.getItem('playlist'));
    if (Array.isArray(parsed)) {
        songs = parsed;
    }
} catch (err) {
    // If parsing fails or value is not an array, fall back to empty array
    songs = [];
}

// Render loaded songs on page load
renderSongs();

form.addEventListener('submit', (e) => {
    // don't submit the form yet. let me handle it
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    // todo: validate inputs

    const song = {
        id: Date.now(),  // Unique ID
        title: title,
        url: url,
        dateAdded: Date.now()
    };

   
    songs.push(song);

    saveAndRender();

    form.reset();
});


function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs();
}



function renderSongs(songArray) {
    list.innerHTML = ''; // Clear current list

    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}


function deleteSong(id) {
    if(confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}




