let songs = [];
let form, list, submitBtn, sortInputs;
// global view flag: true = list (table) view, false = card view
let isListView = true;
let cardContainer, tableEl, listViewBtn, cardViewBtn;
let searchInput, searchBtn;

document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    form = document.getElementById('songForm');
    list = document.getElementById('songList');
    submitBtn = document.getElementById('submitBtn');

    // Load existing songs from localStorage or initialize an empty array
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

    // Get sort radio inputs and re-render on change
    sortInputs = document.querySelectorAll('input[name="sort"]');
    if (sortInputs && sortInputs.length) {
        sortInputs.forEach(r => r.addEventListener('change', () => renderSongs()));
    }

    // Prepare view toggle and card container
    listViewBtn = document.getElementById('listViewBtn');
    cardViewBtn = document.getElementById('cardViewBtn');
    cardContainer = document.getElementById('cardContainer');
    // the existing `list` is the <tbody>; find the table element to show/hide
    tableEl = list ? list.closest('table') : null;

    // Search controls
    searchInput = document.getElementById('search');
    searchBtn = document.getElementById('searchBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            renderSongs();
        });
    }

    if (searchInput) {
        // trigger search on Enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderSongs();
            }
        });
    }

    if (listViewBtn && cardViewBtn) {
        listViewBtn.addEventListener('click', () => {
            isListView = true;
            listViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            renderSongs();
        });
        cardViewBtn.addEventListener('click', () => {
            isListView = false;
            cardViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            renderSongs();
        });
    }

    form.addEventListener('submit', (e) => {
        // don't submit the form yet. let me handle it
        e.preventDefault();

        addSong(form);
    });
});


function addSong(form) {
    // Get form values
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = Number(document.getElementById('rating').value || 0);
    // todo: validate inputs
    const song = {
        id: Date.now(), // Unique ID
        title: title,
        url: url,
        rating: rating,
        youtubeId: getYouTubeID(url),
        dateAdded: Date.now()
    };


    songs.push(song);

    saveAndRender();

    form.reset();
}

function saveAndRender() {
    localStorage.setItem('playlist', JSON.stringify(songs));
    renderSongs();
}



function getYouTubeID(url) {
    try {
        // quick checks for common YouTube URL formats
        const ytRegex = /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const m = url.match(ytRegex);
        if (m && m[1]) return m[1];

        // fallback to URLSearchParams
        const u = new URL(url);
        return u.searchParams.get('v');
    } catch (e) {
        return null;
    }
}

async function fetchVideoTitle(videoId) {
    if (!videoId) return null;
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.title || null;
    } catch (e) {
        return null;
    }
}

function renderSongs() {
    if (isListView) {
        if (tableEl) tableEl.style.display = '';
        if (cardContainer) cardContainer.style.display = 'none';
        renderAsTable();
    } else {
        if (tableEl) tableEl.style.display = 'none';
        if (cardContainer) cardContainer.style.display = '';
        renderAsCards();
    }
}


function showPlayModal(song) {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop show';
    backdrop.style.zIndex = '1040';

    // Modal container
    const modal = document.createElement('div');
    modal.className = 'modal d-block';
    modal.style.zIndex = '1050';

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-center align-items-center" style="min-height:180px;">
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    const titleEl = modal.querySelector('.modal-title');
    const bodyEl = modal.querySelector('.modal-body');
    const closeX = modal.querySelector('.btn-close');

    titleEl.textContent = song.title || 'Video';

    function cleanup() {
        const ifr = modal.querySelector('iframe');
        if (ifr) ifr.src = '';
        backdrop.remove();
        modal.remove();
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') cleanup();
    }

    closeX.addEventListener('click', cleanup);
    backdrop.addEventListener('click', cleanup);
    document.addEventListener('keydown', onKeyDown);

    if (song.youtubeId) {
        const iframe = document.createElement('iframe');
        iframe.width = '560';
        iframe.height = '315';
        iframe.src = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.maxWidth = '100%';
        bodyEl.appendChild(iframe);
    } else {
        const msg = document.createElement('div');
        msg.className = 'text-center text-muted';
        msg.textContent = 'No playable YouTube ID available for this link.';
        bodyEl.appendChild(msg);
    }
}


function renderAsTable() {
    if (!list) return;
    list.innerHTML = ''; // Clear current list

    const toRender = getSortedSongs();

    toRender.forEach(song => {
        const row = document.createElement('tr');

        // Title cell
        const titleTd = document.createElement('td');
        titleTd.textContent = song.title;

        // Play button
        const linkTd = document.createElement('td');
        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'btn btn-sm btn-info';
        playBtn.textContent = song.youtubeId ? 'Play' : 'Play (no ID)';
        playBtn.addEventListener('click', () => showPlayModal(song));
        linkTd.appendChild(playBtn);

        // Video cell (title above thumbnail)
        const videoTd = document.createElement('td');
        videoTd.className = 'align-middle';
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex flex-column align-items-center';
        wrapper.style.maxWidth = '160px';

        const vTitle = document.createElement('div');
        vTitle.className = 'video-title small text-center text-truncate mb-1';
        vTitle.style.width = '100%';
        vTitle.textContent = song.title;

        const videoId = song.youtubeId;
        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';

        const imgContainer = document.createElement('div');
        if (thumbnail) {
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = 'thumbnail';
            img.className = 'img-fluid rounded border';
            img.style.maxWidth = '140px';
            imgContainer.appendChild(img);
        } else {
            const noImg = document.createElement('div');
            noImg.className = 'text-muted small';
            noImg.textContent = 'No thumbnail';
            imgContainer.appendChild(noImg);
        }

        wrapper.appendChild(vTitle);
        wrapper.appendChild(imgContainer);
        videoTd.appendChild(wrapper);

        // Rating cell
        const ratingTd = document.createElement('td');
        ratingTd.innerHTML = `<span class="badge bg-secondary">${song.rating}</span>`;

        // YouTube ID cell
        const youtubeTd = document.createElement('td');
        youtubeTd.className = 'align-middle text-truncate';
        if (videoId) {
            // show plain text id (no link)
            youtubeTd.textContent = videoId;
        } else {
            youtubeTd.textContent = '—';
        }

        // Actions cell
        const actionsTd = document.createElement('td');
        actionsTd.className = 'text-end';
        actionsTd.innerHTML = `
            <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        row.appendChild(titleTd);
        row.appendChild(linkTd);
        row.appendChild(videoTd);
        row.appendChild(ratingTd);
        row.appendChild(youtubeTd);
        row.appendChild(actionsTd);

        list.appendChild(row);

        if (videoId) {
            fetchVideoTitle(videoId).then(realTitle => {
                if (realTitle) vTitle.textContent = realTitle;
            });
        }
    });
}


function renderAsCards() {
    if (!cardContainer) return;
    cardContainer.innerHTML = '';

    const toRender = getSortedSongs();

    toRender.forEach(song => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'card h-100';

        if (song.title) {
            const header = document.createElement('div');
            header.className = 'card-header text-truncate';
            header.title = song.title;
            header.textContent = song.title;
            card.appendChild(header);
        }

        const videoId = song.youtubeId;
        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';

        if (thumbnail) {
            const img = document.createElement('img');
            img.src = thumbnail;
            img.alt = song.title || 'thumbnail';
            img.className = 'card-img-top';
            card.appendChild(img);
        }

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';

        const titleEl = document.createElement('h5');
        titleEl.className = 'card-title text-truncate';
        titleEl.textContent = song.title;

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'btn btn-sm btn-info mb-2';
        playBtn.textContent = song.youtubeId ? 'Play' : 'Play (no ID)';
        playBtn.addEventListener('click', () => showPlayModal(song));

        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'mb-2';
        ratingDiv.innerHTML = `<span class="badge bg-secondary">${song.rating}</span>`;

        body.appendChild(titleEl);
        body.appendChild(playBtn);
        body.appendChild(ratingDiv);

        // YouTube ID display for card view
        const idDiv = document.createElement('div');
        idDiv.className = 'small text-muted text-truncate';
        if (videoId) {
            idDiv.textContent = `ID: ${videoId}`;
        } else {
            idDiv.textContent = 'No ID';
        }
        body.appendChild(idDiv);
        card.appendChild(body);

        const footer = document.createElement('div');
        footer.className = 'card-footer text-end';
        footer.innerHTML = `
            <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        card.appendChild(footer);

        col.appendChild(card);
        cardContainer.appendChild(col);

        if (videoId) {
            fetchVideoTitle(videoId).then(realTitle => {
                if (realTitle) titleEl.textContent = realTitle;
            });
        }
    });
}


// Create a shallow copy of songs and sort according to the select value
function getSortedSongs() {
    // Start with a shallow copy
    const all = [...songs];

    // Apply search filter by title (case-insensitive)
    let searchInput = document.getElementById('search');
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    let toRender = all;
    if (q) {
        toRender = all.filter(s => (s.title || '').toLowerCase().includes(q));
    }

    // Then sort according to selected option
    const checked = document.querySelector('input[name="sort"]:checked');
    const sortVal = checked ? checked.value : 'newest';
    if (sortVal === 'az') {
        toRender.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }));
    } else if (sortVal === 'rating') {
        // Sort by rating descending (highest first)
        toRender.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else { // default/newest
        toRender.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    }

    return toRender;
}

function deleteSong(id) {
    if(confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

function editSong(id) {
        const idx = songs.findIndex(s => s.id === id);
        if (idx === -1) {
                alert('Song not found');
                return;
        }

        const song = songs[idx];

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop show';
        backdrop.style.zIndex = '1040';

        // Modal container (Bootstrap-style structure for consistent look)
        const modal = document.createElement('div');
        modal.className = 'modal d-block';
        modal.style.zIndex = '1050';

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Song</h5>
                        <button type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editSongForm">
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input id="edit-title" class="form-control" type="text" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Link (YouTube URL)</label>
                                <input id="edit-url" class="form-control" type="url" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Rating</label>
                                <select id="edit-rating" class="form-select" required>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="edit-cancel">Cancel</button>
                        <button type="button" class="btn btn-primary" id="edit-save">Save</button>
                    </div>
                </div>
            </div>
        `;

        // Populate fields
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        const titleInput = modal.querySelector('#edit-title');
        const urlInput = modal.querySelector('#edit-url');
        const ratingSelect = modal.querySelector('#edit-rating');
        const saveBtn = modal.querySelector('#edit-save');
        const cancelBtn = modal.querySelector('#edit-cancel');
        const closeX = modal.querySelector('.btn-close');

        titleInput.value = song.title || '';
        urlInput.value = song.url || '';

        // Create rating options (1..10)
        for (let r = 1; r <= 10; r++) {
            const option = document.createElement('option');
            option.value = r;
            option.textContent = r;
            if (song.rating === r) option.selected = true;
            ratingSelect.appendChild(option);
        }

        function cleanup() {
                backdrop.remove();
                modal.remove();
                document.removeEventListener('keydown', onKeyDown);
        }

        function onKeyDown(e) {
                if (e.key === 'Escape') cleanup();
        }

        cancelBtn.addEventListener('click', cleanup);
        closeX.addEventListener('click', cleanup);
        backdrop.addEventListener('click', cleanup);
        document.addEventListener('keydown', onKeyDown);

        saveBtn.addEventListener('click', () => {
                const newTitle = titleInput.value.trim();
                const newUrl = urlInput.value.trim();
                const newRating = Number(ratingSelect.value || 0);

                if (!newTitle) {
                        alert('Please enter a title');
                        return;
                }
                if (!newUrl) {
                        alert('Please enter a URL');
                        return;
                }

                // Update the song but preserve dateAdded
                const updated = Object.assign({}, song, {
                    title: newTitle,
                    url: newUrl,
                    rating: newRating,
                    youtubeId: getYouTubeID(newUrl)
                });

                songs[idx] = updated;

                cleanup();
                saveAndRender();
        });
}




