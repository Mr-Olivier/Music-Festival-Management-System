/**
 * SoundWave Festival - Music Festival Management System
 * Artist Component JavaScript
 */

// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the artists page
  initializeArtistsPage();
});

/**
 * Initialize the Artists Page
 */
function initializeArtistsPage() {
  // Render the initial artists grid and list views
  renderArtistsGrid(artists);
  renderArtistsList(artists);

  // Initialize event listeners
  initializeArtistEventListeners();

  // Handle "Add Artist" form submission
  const saveArtistBtn = document.getElementById("saveArtistBtn");
  if (saveArtistBtn) {
    saveArtistBtn.addEventListener("click", handleAddArtistForm);
  }
}

/**
 * Render Artists in Grid View
 * @param {Array} artistsArray - Array of artist objects to render
 */
function renderArtistsGrid(artistsArray) {
  const gridContainer = document.getElementById("artistsGridView");
  if (!gridContainer) return;

  // Clear existing content
  gridContainer.innerHTML = "";

  // Check if there are artists to display
  if (artistsArray.length === 0) {
    document.getElementById("noResults").style.display = "block";
    gridContainer.style.display = "none";
    document.getElementById("artistsListView").style.display = "none";
    return;
  }

  // Show grid, hide "no results" message
  document.getElementById("noResults").style.display = "none";
  gridContainer.style.display = "flex";

  // Create and append artist cards
  artistsArray.forEach((artist) => {
    const artistCard = createArtistCardElement(artist);
    gridContainer.appendChild(artistCard);
  });
}

/**
 * Create Artist Card Element for Grid View
 * @param {Object} artist - Artist data object
 * @return {HTMLElement} Artist card element
 */
function createArtistCardElement(artist) {
  const colDiv = document.createElement("div");
  colDiv.className = "col-sm-6 col-md-4 col-lg-3";

  colDiv.innerHTML = `
        <div class="artist-card" data-artist-id="${artist.id}">
            <div class="artist-card-image">
                <img src="${
                  artist.image || "../assets/images/ui/artist-placeholder.jpg"
                }" alt="${artist.name}">
            </div>
            <div class="artist-card-content">
                <h3 class="artist-card-name">${artist.name}</h3>
                <div class="artist-card-genre">${artist.genre}</div>
                <div class="artist-card-actions">
                    <div class="artist-card-social">
                        ${
                          artist.socialMedia?.instagram
                            ? `<a href="#" class="social-link"><i class="fab fa-instagram"></i></a>`
                            : ""
                        }
                        ${
                          artist.socialMedia?.twitter
                            ? `<a href="#" class="social-link"><i class="fab fa-twitter"></i></a>`
                            : ""
                        }
                        ${
                          artist.socialMedia?.spotify
                            ? `<a href="#" class="social-link"><i class="fab fa-spotify"></i></a>`
                            : ""
                        }
                    </div>
                    <div class="artist-card-buttons">
                        <button class="btn btn-sm btn-primary view-artist-btn">View Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Add click event for the entire card to show details
  const card = colDiv.querySelector(".artist-card");
  card.addEventListener("click", function (e) {
    if (!e.target.closest(".social-link")) {
      showArtistDetailModal(artist);
    }
  });

  return colDiv;
}

/**
 * Render Artists in List View
 * @param {Array} artistsArray - Array of artist objects to render
 */
function renderArtistsList(artistsArray) {
  const listContainer = document.querySelector("#artistsListView .list-body");
  if (!listContainer) return;

  // Clear existing content
  listContainer.innerHTML = "";

  // Check if there are artists to display (already handled in grid view function)
  if (artistsArray.length === 0) return;

  // Create and append artist list items
  artistsArray.forEach((artist, index) => {
    const artistListItem = createArtistListElement(artist, index + 1);
    listContainer.appendChild(artistListItem);
  });
}

/**
 * Create Artist List Element for List View
 * @param {Object} artist - Artist data object
 * @param {Number} index - Artist index number
 * @return {HTMLElement} Artist list element
 */
function createArtistListElement(artist, index) {
  const rowDiv = document.createElement("div");
  rowDiv.className = "row";
  rowDiv.setAttribute("data-artist-id", artist.id);

  // Count performances
  const performanceCount = countArtistPerformances(artist.id);

  rowDiv.innerHTML = `
        <div class="col-1">${index}</div>
        <div class="col-2">
            <div class="artist-list-image">
                <img src="${
                  artist.image || "../assets/images/ui/artist-placeholder.jpg"
                }" alt="${artist.name}">
            </div>
        </div>
        <div class="col-3">
            <div class="artist-list-name">${artist.name}</div>
            <div class="artist-list-genre">${artist.genre}</div>
        </div>
        <div class="col-2">${artist.genre}</div>
        <div class="col-2">
            ${
              performanceCount > 0
                ? `<span class="artist-badge">${performanceCount} performance${
                    performanceCount !== 1 ? "s" : ""
                  }</span>`
                : '<span class="text-muted">No performances</span>'
            }
        </div>
        <div class="col-2 artist-actions">
            <button class="btn btn-sm btn-artist-edit me-1" title="Edit artist">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-artist-delete" title="Delete artist">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

  // Add click event for the row to show details
  rowDiv.addEventListener("click", function (e) {
    // Don't trigger if clicking on action buttons
    if (!e.target.closest(".artist-actions")) {
      showArtistDetailModal(artist);
    }
  });

  // Add click events for action buttons
  const editBtn = rowDiv.querySelector(".btn-artist-edit");
  const deleteBtn = rowDiv.querySelector(".btn-artist-delete");

  editBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showEditArtistModal(artist);
  });

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    confirmDeleteArtist(artist);
  });

  return rowDiv;
}

/**
 * Count Artist Performances
 * @param {Number} artistId - Artist ID
 * @return {Number} Number of performances
 */
function countArtistPerformances(artistId) {
  let count = 0;

  schedule.forEach((day) => {
    count += day.performances.filter((p) => p.artistId === artistId).length;
  });

  return count;
}

/**
 * Initialize Event Listeners for Artist Page
 */
function initializeArtistEventListeners() {
  // View toggle (Grid/List)
  const gridViewBtn = document.getElementById("gridView");
  const listViewBtn = document.getElementById("listView");

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener("change", function () {
      document.getElementById("artistsGridView").style.display = "flex";
      document.getElementById("artistsListView").style.display = "none";
    });

    listViewBtn.addEventListener("change", function () {
      document.getElementById("artistsGridView").style.display = "none";
      document.getElementById("artistsListView").style.display = "block";
    });
  }

  // Genre filter
  const genreFilter = document.getElementById("genreFilter");
  if (genreFilter) {
    genreFilter.addEventListener("change", function () {
      applyFiltersAndSort();
    });
  }

  // Sort options
  const sortOption = document.getElementById("sortOption");
  if (sortOption) {
    sortOption.addEventListener("change", function () {
      applyFiltersAndSort();
    });
  }

  // Search input
  const searchInput = document.getElementById("artistSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFiltersAndSort();
    });
  }
}

/**
 * Apply Filters and Sorting to Artists
 */
function applyFiltersAndSort() {
  const genreFilter = document.getElementById("genreFilter").value;
  const sortOption = document.getElementById("sortOption").value;
  const searchQuery = document
    .getElementById("artistSearchInput")
    .value.toLowerCase()
    .trim();

  // Filter artists based on genre and search query
  let filteredArtists = artists.filter((artist) => {
    const genreMatch = genreFilter === "" || artist.genre === genreFilter;
    const searchMatch =
      searchQuery === "" ||
      artist.name.toLowerCase().includes(searchQuery) ||
      artist.genre.toLowerCase().includes(searchQuery);

    return genreMatch && searchMatch;
  });

  // Sort artists based on selected option
  filteredArtists.sort((a, b) => {
    switch (sortOption) {
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      case "genreAsc":
        return a.genre.localeCompare(b.genre);
      case "genreDesc":
        return b.genre.localeCompare(a.genre);
      default:
        return 0;
    }
  });

  // Render the filtered and sorted artists
  renderArtistsGrid(filteredArtists);
  renderArtistsList(filteredArtists);
}

/**
 * Show Artist Detail Modal
 * @param {Object} artist - Artist data object
 */
function showArtistDetailModal(artist) {
  // Get artist performances
  const artistPerformances = getArtistPerformances(artist.id);

  // Create modal HTML
  const modalHtml = `
        <div class="modal fade" id="artistDetailModal" tabindex="-1" aria-labelledby="artistDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header p-0">
                        <div class="artist-detail-header">
                            <img src="${
                              artist.image ||
                              "../assets/images/ui/artist-placeholder.jpg"
                            }" alt="${artist.name}">
                            <div class="artist-detail-header-overlay">
                                <h2 class="artist-detail-name">${
                                  artist.name
                                }</h2>
                                <div class="artist-detail-genre">${
                                  artist.genre
                                }</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h5>Biography</h5>
                                <p class="artist-bio">${artist.bio}</p>
                                
                                <h5 class="artist-performances-title">Performances</h5>
                                <div class="artist-performances">
                                    ${
                                      artistPerformances.length > 0
                                        ? artistPerformances
                                            .map(
                                              (perf) => `
                                            <div class="performance-item">
                                                <div class="performance-date">${perf.day} - ${perf.date}</div>
                                                <div class="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div class="performance-time">${perf.startTime} - ${perf.endTime}</div>
                                                        <div class="performance-stage">${perf.stageName}</div>
                                                    </div>
                                                    <div class="performance-description">${perf.description}</div>
                                                </div>
                                            </div>
                                        `
                                            )
                                            .join("")
                                        : '<p class="text-muted">No scheduled performances.</p>'
                                    }
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="artist-detail-sidebar">
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <h5 class="mb-0">Connect</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="artist-detail-social">
                                                ${
                                                  artist.socialMedia?.instagram
                                                    ? `<a href="#" class="social-link"><i class="fab fa-instagram"></i></a>`
                                                    : ""
                                                }
                                                ${
                                                  artist.socialMedia?.twitter
                                                    ? `<a href="#" class="social-link"><i class="fab fa-twitter"></i></a>`
                                                    : ""
                                                }
                                                ${
                                                  artist.socialMedia?.spotify
                                                    ? `<a href="#" class="social-link"><i class="fab fa-spotify"></i></a>`
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="mb-0">Management</h5>
                                        </div>
                                        <div class="card-body">
                                            <button class="btn btn-primary w-100 mb-2" onclick="showEditArtistModal(${
                                              artist.id
                                            })">
                                                <i class="fas fa-edit me-2"></i> Edit Artist
                                            </button>
                                            <button class="btn btn-outline-danger w-100" onclick="confirmDeleteArtist(${
                                              artist.id
                                            })">
                                                <i class="fas fa-trash-alt me-2"></i> Delete Artist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Append modal to body
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  // Initialize and show modal
  const modalElement = document.getElementById("artistDetailModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Clean up when modal is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Get Artist Performances
 * @param {Number} artistId - Artist ID
 * @return {Array} Array of performance objects with additional data
 */
function getArtistPerformances(artistId) {
  const performances = [];

  schedule.forEach((day) => {
    const dayPerformances = day.performances.filter(
      (p) => p.artistId === artistId
    );

    dayPerformances.forEach((performance) => {
      const stage = getStageById(performance.stageId);

      performances.push({
        ...performance,
        day: day.day,
        date: day.date,
        stageName: stage.name,
      });
    });
  });

  // Sort by day and start time
  performances.sort((a, b) => {
    if (a.day !== b.day) {
      return a.day.localeCompare(b.day);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  return performances;
}

/**
 * Show Edit Artist Modal
 * @param {Object|Number} artistOrId - Artist object or ID
 */
function showEditArtistModal(artistOrId) {
  // Get artist object if ID was passed
  let artist;
  if (typeof artistOrId === "number") {
    artist = artists.find((a) => a.id === artistOrId);
  } else {
    artist = artistOrId;
  }

  if (!artist) return;

  // Reuse the add artist modal but populate it with artist data
  const addArtistModal = document.getElementById("addArtistModal");
  if (!addArtistModal) return;

  // Update modal title
  const modalTitle = addArtistModal.querySelector(".modal-title");
  modalTitle.textContent = "Edit Artist";

  // Populate form fields
  document.getElementById("artistName").value = artist.name;
  document.getElementById("artistGenre").value = artist.genre;
  document.getElementById("artistBio").value = artist.bio;
  document.getElementById("isPopular").checked = artist.popular;

  // Social media
  if (artist.socialMedia) {
    document.getElementById("instagramHandle").value =
      artist.socialMedia.instagram || "";
    document.getElementById("twitterHandle").value =
      artist.socialMedia.twitter || "";
    document.getElementById("spotifyHandle").value =
      artist.socialMedia.spotify || "";
  }

  // Store artist ID in the form for update
  const form = document.getElementById("addArtistForm");
  form.dataset.artistId = artist.id;

  // Update save button text
  const saveBtn = document.getElementById("saveArtistBtn");
  saveBtn.textContent = "Update Artist";

  // Show the modal
  const modal = new bootstrap.Modal(addArtistModal);
  modal.show();
}

/**
 * Handle Add/Edit Artist Form Submission
 */
function handleAddArtistForm() {
  const form = document.getElementById("addArtistForm");
  const artistId = form.dataset.artistId;

  // Get form values
  const artistName = document.getElementById("artistName").value.trim();
  const artistGenre = document.getElementById("artistGenre").value;
  const artistBio = document.getElementById("artistBio").value.trim();
  const isPopular = document.getElementById("isPopular").checked;

  // Social media handles
  const instagram = document.getElementById("instagramHandle").value.trim();
  const twitter = document.getElementById("twitterHandle").value.trim();
  const spotify = document.getElementById("spotifyHandle").value.trim();

  // Validate required fields
  if (!artistName || !artistGenre || !artistBio) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create artist object
  const artistData = {
    name: artistName,
    genre: artistGenre,
    bio: artistBio,
    popular: isPopular,
    // In a real app, we'd handle image upload
    image:
      "../assets/images/artists/artist" +
      (Math.floor(Math.random() * 8) + 1) +
      ".jpg",
    socialMedia: {
      instagram: instagram,
      twitter: twitter,
      spotify: spotify,
    },
  };

  // Check if adding new or editing existing
  if (artistId) {
    // Find the artist in the array
    const index = artists.findIndex((a) => a.id === parseInt(artistId));
    if (index !== -1) {
      // Update existing artist (preserve id)
      artistData.id = parseInt(artistId);
      artists[index] = artistData;

      // Show success message
      alert("Artist updated successfully!");
    }
  } else {
    // Adding new artist
    // Generate new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...artists.map((a) => a.id)) + 1;
    artistData.id = newId;

    // Add to artists array
    artists.push(artistData);

    // Show success message
    alert("New artist added successfully!");
  }

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addArtistModal")
  );
  modal.hide();

  // Reset the form
  form.reset();
  delete form.dataset.artistId;

  // Update both grid and list views
  renderArtistsGrid(artists);
  renderArtistsList(artists);
}

/**
 * Confirm Delete Artist
 * @param {Object|Number} artistOrId - Artist object or ID
 */
function confirmDeleteArtist(artistOrId) {
  // Get artist object if ID was passed
  let artist;
  if (typeof artistOrId === "number") {
    artist = artists.find((a) => a.id === artistOrId);
  } else {
    artist = artistOrId;
  }

  if (!artist) return;

  // Close any existing modals
  const existingModals = document.querySelectorAll(".modal");
  existingModals.forEach((modalEl) => {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  });

  // Create confirmation modal HTML
  const modalHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteConfirmModalLabel">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete the artist <strong>${
                          artist.name
                        }</strong>?</p>
                        <p class="text-danger">This action cannot be undone.</p>
                        
                        ${
                          countArtistPerformances(artist.id) > 0
                            ? `<div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                This artist has scheduled performances that will also be removed.
                            </div>`
                            : ""
                        }
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete Artist</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Append modal to body
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  // Initialize and show modal
  const modalElement = document.getElementById("deleteConfirmModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", function () {
    // Remove artist from array
    const index = artists.findIndex((a) => a.id === artist.id);
    if (index !== -1) {
      artists.splice(index, 1);

      // Remove any performances by this artist
      schedule.forEach((day) => {
        day.performances = day.performances.filter(
          (p) => p.artistId !== artist.id
        );
      });

      // Update views
      renderArtistsGrid(artists);
      renderArtistsList(artists);

      // Show success message
      alert("Artist deleted successfully!");

      // Close modal
      modal.hide();
    }
  });

  // Clean up when modal is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Reset Add Artist Form
 */
function resetAddArtistForm() {
  const form = document.getElementById("addArtistForm");
  if (!form) return;

  // Clear form inputs
  form.reset();

  // Clear artist ID if it was set for editing
  delete form.dataset.artistId;

  // Reset modal title
  const modalTitle = document.querySelector("#addArtistModal .modal-title");
  if (modalTitle) modalTitle.textContent = "Add New Artist";

  // Reset save button text
  const saveBtn = document.getElementById("saveArtistBtn");
  if (saveBtn) saveBtn.textContent = "Save Artist";
}

// Initialize "add artist" modal reset when closed
document.addEventListener("DOMContentLoaded", function () {
  const addArtistModal = document.getElementById("addArtistModal");
  if (addArtistModal) {
    addArtistModal.addEventListener("hidden.bs.modal", resetAddArtistForm);
  }
});
