/**
 * SoundWave Festival - Music Festival Management System
 * Stages Component JavaScript
 */

// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the stages page
  initializeStagesPage();
});

/**
 * Initialize the Stages Page
 */
function initializeStagesPage() {
  // Render stages
  renderStages();

  // Update statistics
  updateStageStatistics();

  // Initialize event listeners
  initializeStageEventListeners();

  // Handle "Add Stage" form submission
  const saveStageBtn = document.getElementById("saveStageBtn");
  if (saveStageBtn) {
    saveStageBtn.addEventListener("click", handleAddStageForm);
  }
}

/**
 * Render Stages
 * @param {Array} filteredStages - Optional array of filtered stages to display
 */
function renderStages(filteredStages = null) {
  const stagesGrid = document.getElementById("stagesGrid");
  if (!stagesGrid) return;

  // Clear existing content
  stagesGrid.innerHTML = "";

  // Use filtered stages or all stages
  const stagesToDisplay = filteredStages || stages;

  // Display stages
  stagesToDisplay.forEach((stage) => {
    const stageElement = createStageElement(stage);
    stagesGrid.appendChild(stageElement);
  });
}

/**
 * Create Stage Element
 * @param {Object} stage - Stage data
 * @returns {HTMLElement} Stage card element
 */
function createStageElement(stage) {
  const colDiv = document.createElement("div");
  colDiv.className = "col-md-6 col-lg-6 col-xl-4";

  // Count performances for this stage
  const performances = countStagePerformances(stage.id);

  // Get stage class for styling
  const stageClass = getStageClass(stage.name);

  colDiv.innerHTML = `
        <div class="stage-card" data-stage-id="${stage.id}">
            <div class="stage-image">
                <img src="${
                  stage.image || "../assets/images/ui/stage-placeholder.jpg"
                }" alt="${stage.name}">
                <div class="stage-image-overlay ${stageClass}-overlay"></div>
            </div>
            <div class="stage-content">
                <h3 class="stage-name">${stage.name}</h3>
                <div class="stage-meta">
                    <div class="stage-meta-item">
                        <i class="fas fa-map-marker-alt"></i> ${stage.location}
                    </div>
                    <div class="stage-meta-item">
                        <i class="fas fa-users"></i> Capacity: ${stage.capacity.toLocaleString()}
                    </div>
                    <div class="stage-meta-item">
                        <i class="fas fa-music"></i> ${performances} Performance${
    performances !== 1 ? "s" : ""
  }
                    </div>
                </div>
                <p class="stage-description">${stage.description}</p>
                
                ${
                  stage.facilities.length > 0
                    ? `
                    <div class="stage-facilities">
                        <h4 class="facilities-title">Facilities</h4>
                        <ul class="facilities-list">
                            ${stage.facilities
                              .map((facility) => `<li>${facility}</li>`)
                              .join("")}
                        </ul>
                    </div>
                `
                    : ""
                }
                
                <div class="stage-actions">
                    <button class="btn btn-primary view-stage-btn" data-stage-id="${
                      stage.id
                    }">
                        <i class="fas fa-info-circle me-1"></i> View Details
                    </button>
                    <button class="btn btn-outline-primary view-schedule-btn" data-stage-id="${
                      stage.id
                    }">
                        <i class="fas fa-calendar-alt me-1"></i> View Schedule
                    </button>
                </div>
            </div>
        </div>
    `;

  // Add event listeners
  const viewStageBtn = colDiv.querySelector(".view-stage-btn");
  const viewScheduleBtn = colDiv.querySelector(".view-schedule-btn");

  viewStageBtn.addEventListener("click", function () {
    showStageDetailModal(stage);
  });

  viewScheduleBtn.addEventListener("click", function () {
    window.location.href = "schedule.html";
  });

  return colDiv;
}

/**
 * Count Performances for a Stage
 * @param {Number} stageId - Stage ID
 * @returns {Number} Number of performances
 */
function countStagePerformances(stageId) {
  let count = 0;

  schedule.forEach((day) => {
    count += day.performances.filter((p) => p.stageId === stageId).length;
  });

  return count;
}

/**
 * Get CSS Class for Stage
 * @param {String} stageName - Name of the stage
 * @return {String} CSS Class for the stage
 */
function getStageClass(stageName) {
  const normalized = stageName.toLowerCase().replace(/\s+/g, "-");

  switch (normalized) {
    case "main-stage":
      return "main-stage";
    case "electronic-dome":
      return "electronic-dome";
    case "acoustic-grove":
      return "acoustic-grove";
    case "urban-corner":
      return "urban-corner";
    default:
      return "default-stage";
  }
}

/**
 * Update Stage Statistics
 */
function updateStageStatistics() {
  // Update total stages count
  const totalStagesCount = document.getElementById("totalStagesCount");
  if (totalStagesCount) {
    totalStagesCount.textContent = stages.length;
  }

  // Update total capacity
  const totalCapacity = document.getElementById("totalCapacity");
  if (totalCapacity) {
    const capacity = stages.reduce((sum, stage) => sum + stage.capacity, 0);
    totalCapacity.textContent = capacity.toLocaleString();
  }

  // Update total performances
  const totalPerformances = document.getElementById("totalPerformances");
  if (totalPerformances) {
    let count = 0;
    schedule.forEach((day) => {
      count += day.performances.length;
    });
    totalPerformances.textContent = count;
  }
}

/**
 * Initialize Stage Event Listeners
 */
function initializeStageEventListeners() {
  // Apply filters button
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters);
  }

  // Facility inputs in Add Stage modal
  const addFacilityBtn = document.querySelector(".add-facility-btn");
  if (addFacilityBtn) {
    addFacilityBtn.addEventListener("click", addFacility);
  }

  // Search input
  const searchInput = document.getElementById("stageSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applyFilters();
    });
  }
}

/**
 * Apply Filters
 */
function applyFilters() {
  // Get capacity filter
  const capacityFilter = document.getElementById("capacityFilter").value;

  // Get location filters (checked checkboxes)
  const locationFilters = [];
  document.querySelectorAll(".location-filter:checked").forEach((checkbox) => {
    locationFilters.push(checkbox.value);
  });

  // Get search query
  const searchQuery =
    document.getElementById("stageSearchInput")?.value.toLowerCase().trim() ||
    "";

  // Filter stages
  const filteredStages = stages.filter((stage) => {
    // Filter by capacity
    if (capacityFilter !== "all") {
      if (capacityFilter === "small" && stage.capacity >= 3000) return false;
      if (
        capacityFilter === "medium" &&
        (stage.capacity < 3000 || stage.capacity > 5000)
      )
        return false;
      if (capacityFilter === "large" && stage.capacity <= 5000) return false;
    }

    // Filter by location
    if (locationFilters.length > 0 && !locationFilters.includes(stage.location))
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !stage.name.toLowerCase().includes(searchQuery) &&
      !stage.description.toLowerCase().includes(searchQuery) &&
      !stage.location.toLowerCase().includes(searchQuery)
    ) {
      return false;
    }

    return true;
  });

  // Render filtered stages
  renderStages(filteredStages);
}

/**
 * Add Facility to Facility Tags
 */
function addFacility() {
  const facilityInput = document.querySelector(".facility-input");
  const facilityTags = document.getElementById("facilityTags");

  if (facilityInput && facilityTags && facilityInput.value.trim() !== "") {
    const facilityText = facilityInput.value.trim();

    const facilityTag = document.createElement("div");
    facilityTag.className = "facility-tag";
    facilityTag.innerHTML = `
            <span>${facilityText}</span>
            <span class="remove-facility"><i class="fas fa-times"></i></span>
        `;

    // Add click event to remove facility
    facilityTag
      .querySelector(".remove-facility")
      .addEventListener("click", function () {
        facilityTag.remove();
      });

    facilityTags.appendChild(facilityTag);
    facilityInput.value = "";
    facilityInput.focus();
  }
}

/**
 * Handle Add Stage Form Submission
 */
function handleAddStageForm() {
  const form = document.getElementById("addStageForm");
  const stageId = form.dataset.stageId;

  // Get form values
  const stageName = document.getElementById("stageName").value.trim();
  const stageLocation = document.getElementById("stageLocation").value.trim();
  const stageCapacity = parseInt(
    document.getElementById("stageCapacity").value
  );
  const stageDescription = document
    .getElementById("stageDescription")
    .value.trim();

  // Get facilities
  const facilities = [];
  document.querySelectorAll("#facilityTags .facility-tag").forEach((tag) => {
    facilities.push(tag.querySelector("span").textContent);
  });

  // Validate required fields
  if (
    !stageName ||
    !stageLocation ||
    isNaN(stageCapacity) ||
    !stageDescription
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Create stage object
  const stageData = {
    name: stageName,
    location: stageLocation,
    capacity: stageCapacity,
    description: stageDescription,
    facilities: facilities,
    // In a real app, we'd handle image upload
    image:
      "../assets/images/stages/stage" +
      (Math.floor(Math.random() * 4) + 1) +
      ".jpg",
  };

  // Check if adding new or editing existing
  if (stageId) {
    // Edit existing stage
    stageData.id = parseInt(stageId);

    // Find and update the stage
    const index = stages.findIndex((s) => s.id === stageData.id);
    if (index !== -1) {
      stages[index] = stageData;
      alert("Stage updated successfully!");
    }
  } else {
    // Add new stage
    // Generate new ID
    const newId = Math.max(...stages.map((s) => s.id)) + 1;
    stageData.id = newId;

    // Add to stages array
    stages.push(stageData);
    alert("New stage added successfully!");
  }

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addStageModal")
  );
  modal.hide();

  // Reset the form
  form.reset();
  document.getElementById("facilityTags").innerHTML = "";
  delete form.dataset.stageId;

  // Update stage display
  renderStages();

  // Update statistics
  updateStageStatistics();
}

/**
 * Show Stage Detail Modal
 * @param {Object} stage - Stage object
 */
function showStageDetailModal(stage) {
  const stageDetailContent = document.getElementById("stageDetailContent");
  if (!stageDetailContent) return;

  // Count performances for this stage
  const performances = countStagePerformances(stage.id);

  // Get performances for this stage
  const stagePerformances = getStagePerformances(stage.id);

  // Get stage class for styling
  const stageClass = getStageClass(stage.name);

  // Update modal content
  stageDetailContent.innerHTML = `
        <div class="stage-detail-image ${stageClass}-bg">
            <img src="${
              stage.image || "../assets/images/ui/stage-placeholder.jpg"
            }" alt="${stage.name}">
            <div class="stage-detail-image-overlay"></div>
        </div>
        
        <div class="stage-detail-info">
            <div class="row">
                <div class="col-md-6">
                    <h3 class="stage-detail-name">${stage.name}</h3>
                    <div class="stage-detail-meta">
                        <div class="stage-meta-item">
                            <i class="fas fa-map-marker-alt"></i> ${
                              stage.location
                            }
                        </div>
                        <div class="stage-meta-item">
                            <i class="fas fa-users"></i> Capacity: ${stage.capacity.toLocaleString()}
                        </div>
                        <div class="stage-meta-item">
                            <i class="fas fa-music"></i> ${performances} Performance${
    performances !== 1 ? "s" : ""
  }
                        </div>
                    </div>
                    <div class="stage-detail-description">
                        <h4>Description</h4>
                        <p>${stage.description}</p>
                    </div>
                </div>
                
                <div class="col-md-6">
                    ${
                      stage.facilities.length > 0
                        ? `
                        <div class="stage-detail-facilities">
                            <h4>Facilities & Equipment</h4>
                            <ul class="facilities-list">
                                ${stage.facilities
                                  .map((facility) => `<li>${facility}</li>`)
                                  .join("")}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="stage-detail-schedule">
                        <h4>Upcoming Performances</h4>
                        ${
                          stagePerformances.length > 0
                            ? `
                            <div class="upcoming-performances">
                                ${stagePerformances
                                  .slice(0, 3)
                                  .map(
                                    (perf) => `
                                    <div class="upcoming-performance-item">
                                        <div class="performance-time">${perf.day} - ${perf.startTime} to ${perf.endTime}</div>
                                        <div class="performance-artist">${perf.artistName}</div>
                                    </div>
                                `
                                  )
                                  .join("")}
                                ${
                                  stagePerformances.length > 3
                                    ? `
                                    <a href="schedule.html" class="btn btn-link">View all performances <i class="fas fa-arrow-right ms-1"></i></a>
                                `
                                    : ""
                                }
                            </div>
                        `
                            : `
                            <p class="text-muted">No performances scheduled for this stage yet.</p>
                        `
                        }
                    </div>
                </div>
            </div>
        </div>
    `;

  // Store stage ID in modal for edit/delete actions
  const modal = document.getElementById("stageDetailModal");
  modal.dataset.stageId = stage.id;

  // Edit button event
  const editBtn = document.getElementById("editStageBtn");
  if (editBtn) {
    editBtn.onclick = function () {
      editStage(stage);
    };
  }

  // Delete button event
  const deleteBtn = document.getElementById("deleteStageBtn");
  if (deleteBtn) {
    deleteBtn.onclick = function () {
      confirmDeleteStage(stage);
    };
  }

  // Update modal header class
  const modalHeader = document.querySelector(".stage-detail-header");
  if (modalHeader) {
    // Remove existing stage classes
    modalHeader.classList.remove(
      "main-stage-header",
      "electronic-dome-header",
      "acoustic-grove-header",
      "urban-corner-header"
    );
    // Add appropriate class
    modalHeader.classList.add(`${stageClass}-header`);
  }

  // Show modal
  const stageModal = new bootstrap.Modal(modal);
  stageModal.show();
}

/**
 * Get Performances for a Stage
 * @param {Number} stageId - Stage ID
 * @returns {Array} Array of performances with additional data
 */
function getStagePerformances(stageId) {
  const performances = [];

  schedule.forEach((day) => {
    const dayPerformances = day.performances.filter(
      (p) => p.stageId === stageId
    );

    dayPerformances.forEach((performance) => {
      const artist = getArtistById(performance.artistId);

      performances.push({
        ...performance,
        day: day.day,
        date: day.date,
        artistName: artist ? artist.name : "Unknown Artist",
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
