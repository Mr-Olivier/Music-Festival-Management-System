/**
 * SoundWave Festival - Music Festival Management System
 * Profile Component JavaScript
 */

// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the profile page
  initializeProfilePage();
});

/**
 * Initialize the Profile Page
 */
function initializeProfilePage() {
  // Populate favorite artists
  populateFavoriteArtists();

  // Initialize event listeners
  initializeProfileEventListeners();
}

/**
 * Populate Favorite Artists
 */
function populateFavoriteArtists() {
  const favoriteArtistsGrid = document.getElementById("favoriteArtistsGrid");
  if (!favoriteArtistsGrid) return;

  // Clear existing content
  favoriteArtistsGrid.innerHTML = "";

  // Get favorite artists from user profile
  const favoriteArtistIds = userProfile.favoriteArtists || [];

  if (favoriteArtistIds.length === 0) {
    favoriteArtistsGrid.innerHTML = `
            <div class="col-12 text-center py-4">
                <div class="empty-favorites">
                    <i class="fas fa-heart fa-3x text-muted mb-3"></i>
                    <h4>No Favorite Artists</h4>
                    <p class="text-muted">You haven't added any artists to your favorites yet.</p>
                    <a href="artists.html" class="btn btn-primary">Browse Artists</a>
                </div>
            </div>
        `;
    return;
  }

  // Find the favorite artists in the artists array
  const favoriteArtists = favoriteArtistIds
    .map((id) => getArtistById(id))
    .filter((artist) => artist);

  // Display favorite artists
  favoriteArtists.forEach((artist) => {
    const artistElement = createFavoriteArtistElement(artist);
    favoriteArtistsGrid.appendChild(artistElement);
  });
}

/**
 * Create Favorite Artist Element
 * @param {Object} artist - Artist object
 * @returns {HTMLElement} Artist card element
 */
function createFavoriteArtistElement(artist) {
  const colDiv = document.createElement("div");
  colDiv.className = "col-sm-6 col-md-4 col-xl-3";

  colDiv.innerHTML = `
        <div class="artist-card" data-artist-id="${artist.id}">
            <div class="artist-image">
                <img src="${
                  artist.image || "../assets/images/ui/artist-placeholder.jpg"
                }" alt="${artist.name}">
            </div>
            <div class="artist-content">
                <h3 class="artist-name">${artist.name}</h3>
                <div class="artist-genre">${artist.genre}</div>
                <div class="artist-actions">
                    <a href="artists.html" class="btn btn-sm btn-outline-primary">View Details</a>
                    <div class="artist-remove" data-artist-id="${
                      artist.id
                    }" title="Remove from favorites">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Add event listener for remove button
  const removeBtn = colDiv.querySelector(".artist-remove");
  removeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    removeFromFavorites(artist.id);
  });

  return colDiv;
}

/**
 * Remove Artist from Favorites
 * @param {Number} artistId - Artist ID
 */
function removeFromFavorites(artistId) {
  // Find the index of the artist in favorites
  const index = userProfile.favoriteArtists.indexOf(artistId);

  if (index !== -1) {
    // Remove from favorites
    userProfile.favoriteArtists.splice(index, 1);

    // Update display
    populateFavoriteArtists();

    // Show success message
    showNotification("Artist removed from favorites");
  }
}

/**
 * Initialize Profile Event Listeners
 */
function initializeProfileEventListeners() {
  // Edit profile button
  const editProfileBtn = document.getElementById("editProfileBtn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      document.getElementById("profileInfoView").style.display = "none";
      document.getElementById("profileInfoEdit").style.display = "block";
    });
  }

  // Cancel edit button
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function () {
      document.getElementById("profileInfoEdit").style.display = "none";
      document.getElementById("profileInfoView").style.display = "block";
    });
  }

  // Save profile button
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", function () {
      saveProfileChanges();
    });
  }

  // Save preferences button
  const savePreferencesBtn = document.getElementById("savePreferencesBtn");
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener("click", function () {
      savePreferences();
    });
  }

  // Save notification settings button
  const saveNotificationsBtn = document.getElementById("saveNotificationsBtn");
  if (saveNotificationsBtn) {
    saveNotificationsBtn.addEventListener("click", function () {
      saveNotificationSettings();
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // In a real application, this would handle logout logic
      window.location.href = "../index.html";
    });
  }

  // Accessibility dropdown change
  const accessibilitySelect = document.getElementById("accessibilityNeeds");
  if (accessibilitySelect) {
    accessibilitySelect.addEventListener("change", function () {
      const specifyDiv = document.getElementById("accessibilitySpecify");
      if (accessibilitySelect.value === "other") {
        specifyDiv.style.display = "block";
      } else {
        specifyDiv.style.display = "none";
      }
    });
  }
}

/**
 * Save Profile Changes
 */
function saveProfileChanges() {
  // Get form values
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const password = document.getElementById("editPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate required fields
  if (!name || !email) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate password match if provided
  if (password && password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Update user profile
  userProfile.name = name;
  userProfile.email = email;

  // Update UI
  document.querySelector(".profile-name").textContent = name;
  document.querySelectorAll(".info-value")[0].textContent = name;
  document.querySelectorAll(".info-value")[1].textContent = email;
  document.querySelectorAll(".info-value")[2].textContent = phone;

  // Hide edit form, show info view
  document.getElementById("profileInfoEdit").style.display = "none";
  document.getElementById("profileInfoView").style.display = "block";

  // Show success message
  showNotification("Profile updated successfully");
}

/**
 * Save Preferences
 */
function savePreferences() {
  // Get selected genres
  const selectedGenres = [];
  document
    .querySelectorAll('.genre-preferences input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedGenres.push(checkbox.id.replace("genre", ""));
    });

  // Get dietary preference
  const dietary = document.getElementById("dietaryPreference").value;

  // Get accessibility needs
  const accessibility = document.getElementById("accessibilityNeeds").value;
  let accessibilityNotes = "";

  if (accessibility === "other") {
    accessibilityNotes = document
      .getElementById("accessibilityNotes")
      .value.trim();
  }

  // Update user profile
  userProfile.preferences = {
    genres: selectedGenres,
    dietary: dietary,
    accessibility: accessibility,
    accessibilityNotes: accessibilityNotes,
  };

  // Show success message
  showNotification("Preferences saved successfully");
}

/**
 * Save Notification Settings
 */
function saveNotificationSettings() {
  // Get notification settings
  const emailNotifications =
    document.getElementById("emailNotifications").checked;
  const appNotifications = document.getElementById("appNotifications").checked;
  const scheduleNotifications = document.getElementById(
    "scheduleNotifications"
  ).checked;
  const artistNotifications = document.getElementById(
    "artistNotifications"
  ).checked;
  const promoNotifications =
    document.getElementById("promoNotifications").checked;
  const partnerNotifications = document.getElementById(
    "partnerNotifications"
  ).checked;

  // Update user profile
  userProfile.notifications = {
    email: emailNotifications,
    app: appNotifications,
    schedule: scheduleNotifications,
    artists: artistNotifications,
    promos: promoNotifications,
    partners: partnerNotifications,
  };

  // Show success message
  showNotification("Notification settings saved");
}

/**
 * Show Notification
 * @param {String} message - Notification message
 */
function showNotification(message) {
  // Create toast notification
  const toastHtml = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
            <div class="toast" id="notificationToast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong class="me-auto">Success</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;

  // Append toast to body
  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = toastHtml;
  document.body.appendChild(toastContainer);

  // Initialize and show toast
  const toastElement = document.getElementById("notificationToast");
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 3000,
  });
  toast.show();

  // Clean up when toast is hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastContainer.remove();
  });
}
