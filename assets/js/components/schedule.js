/**
 * SoundWave Festival - Music Festival Management System
 * Schedule Component JavaScript
 */

// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the schedule page
  initializeSchedulePage();
});

/**
 * Initialize the Schedule Page
 */
function initializeSchedulePage() {
  // Populate artist and stage select options
  populateSelectOptions();

  // Initialize the timeline views for each day
  initializeTimelineView("friday", 0);
  initializeTimelineView("saturday", 1);
  initializeTimelineView("sunday", 2);

  // Initialize the stage views for each day
  initializeStageView("friday", 0);
  initializeStageView("saturday", 1);
  initializeStageView("sunday", 2);

  // Initialize event listeners
  initializeScheduleEventListeners();

  // Handle "Add Performance" form submission
  const savePerformanceBtn = document.getElementById("savePerformanceBtn");
  if (savePerformanceBtn) {
    savePerformanceBtn.addEventListener("click", handleAddPerformanceForm);
  }
}

/**
 * Populate Select Options for Artists and Stages
 */
function populateSelectOptions() {
  // Populate artist options
  const artistSelect = document.getElementById("performanceArtist");
  if (artistSelect) {
    // Clear existing options except the first one
    while (artistSelect.options.length > 1) {
      artistSelect.remove(1);
    }

    // Add artist options
    artists.forEach((artist) => {
      const option = document.createElement("option");
      option.value = artist.id;
      option.textContent = artist.name;
      artistSelect.appendChild(option);
    });
  }

  // Populate stage options
  const stageSelect = document.getElementById("performanceStage");
  if (stageSelect) {
    // Clear existing options except the first one
    while (stageSelect.options.length > 1) {
      stageSelect.remove(1);
    }

    // Add stage options
    stages.forEach((stage) => {
      const option = document.createElement("option");
      option.value = stage.id;
      option.textContent = stage.name;
      stageSelect.appendChild(option);
    });
  }
}

/**
 * Initialize Timeline View for a Specific Day
 * @param {String} dayId - The ID/name of the day (e.g., 'friday')
 * @param {Number} dayIndex - The index of the day in the schedule array
 */
function initializeTimelineView(dayId, dayIndex) {
  const timelineHeader = document.querySelector(
    `#${dayId}TimelineView .timeline-header .stage-labels`
  );
  const timelineBody = document.querySelector(
    `#${dayId}TimelineView .timeline-body`
  );

  if (!timelineHeader || !timelineBody) return;

  // Clear existing content
  timelineHeader.innerHTML = "";
  timelineBody.innerHTML = "";

  // Add stage labels to header
  stages.forEach((stage) => {
    const stageLabel = document.createElement("div");
    stageLabel.className = "stage-label";
    stageLabel.textContent = stage.name;
    timelineHeader.appendChild(stageLabel);
  });

  // Create time slots and grid
  const timeSlots = document.createElement("div");
  timeSlots.className = "time-slots";

  const timeColumn = document.createElement("div");
  timeColumn.className = "time-column";

  // Create grid for each hour from 12:00 to 23:00
  for (let hour = 12; hour <= 23; hour++) {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    timeSlot.textContent = `${hour}:00`;
    timeColumn.appendChild(timeSlot);
  }

  timeSlots.appendChild(timeColumn);

  // Create timeline grid for performances
  const timelineGrid = document.createElement("div");
  timelineGrid.className = "timeline-grid";

  // Create a column for each stage
  stages.forEach((stage) => {
    const stageColumn = document.createElement("div");
    stageColumn.className = "timeline-column";
    stageColumn.dataset.stageId = stage.id;

    // Create hour grid lines
    const hourGrid = document.createElement("div");
    hourGrid.className = "hour-grid";

    for (let hour = 12; hour <= 23; hour++) {
      const hourLine = document.createElement("div");
      hourLine.className = "hour-line";
      hourLine.style.top = `${(hour - 12) * 60}px`;
      hourGrid.appendChild(hourLine);
    }

    stageColumn.appendChild(hourGrid);
    timelineGrid.appendChild(stageColumn);
  });

  timeSlots.appendChild(timelineGrid);
  timelineBody.appendChild(timeSlots);

  // Add performances to the grid
  if (schedule[dayIndex]) {
    const daySchedule = schedule[dayIndex];

    daySchedule.performances.forEach((performance) => {
      const stageColumn = timelineGrid.querySelector(
        `.timeline-column[data-stage-id="${performance.stageId}"]`
      );

      if (stageColumn) {
        const startTimeParts = performance.startTime.split(":");
        const endTimeParts = performance.endTime.split(":");

        const startHour = parseInt(startTimeParts[0]);
        const startMinute = parseInt(startTimeParts[1]);
        const endHour = parseInt(endTimeParts[0]);
        const endMinute = parseInt(endTimeParts[1]);

        // Calculate position and height
        const topPosition = (startHour - 12) * 60 + startMinute;
        const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

        // Create performance card
        const performanceCard = createPerformanceCard(
          performance,
          topPosition,
          duration
        );
        stageColumn.appendChild(performanceCard);
      }
    });
  }
}

/**
 * Create Performance Card for Timeline View
 * @param {Object} performance - Performance object
 * @param {Number} topPosition - Top position in pixels
 * @param {Number} duration - Duration in minutes
 * @return {HTMLElement} Performance card element
 */
function createPerformanceCard(performance, topPosition, duration) {
  const artist = getArtistById(performance.artistId);
  const stage = getStageById(performance.stageId);

  if (!artist || !stage) return null;

  const performanceCard = document.createElement("div");
  performanceCard.className = `performance-card ${getStageClass(stage.name)}`;
  performanceCard.style.top = `${topPosition}px`;
  performanceCard.style.height = `${duration}px`;
  performanceCard.dataset.performanceId = performance.id;

  performanceCard.innerHTML = `
        <div class="performance-time">${performance.startTime} - ${
    performance.endTime
  }</div>
        <div class="performance-artist">${artist.name}</div>
        <div class="performance-description">${
          performance.description || ""
        }</div>
    `;

  // Add click event for performance details
  performanceCard.addEventListener("click", function () {
    showPerformanceDetail(performance);
  });

  return performanceCard;
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
      return "";
  }
}

/**
 * Initialize Stage View for a Specific Day
 * @param {String} dayId - The ID/name of the day (e.g., 'friday')
 * @param {Number} dayIndex - The index of the day in the schedule array
 */
function initializeStageView(dayId, dayIndex) {
  const stageContainer = document.getElementById(`${dayId}StageCards`);

  if (!stageContainer) return;

  // Clear existing content
  stageContainer.innerHTML = "";

  // Create stage cards
  stages.forEach((stage) => {
    const stageCard = createStageCard(stage, dayIndex);
    stageContainer.appendChild(stageCard);
  });
}

/**
 * Create Stage Card for Stage View
 * @param {Object} stage - Stage object
 * @param {Number} dayIndex - The index of the day in the schedule array
 * @return {HTMLElement} Stage card element
 */
function createStageCard(stage, dayIndex) {
  const colDiv = document.createElement("div");
  colDiv.className = "col-md-6 col-lg-3";

  // Get performances for this stage on this day
  const stagePerformances =
    schedule[dayIndex]?.performances.filter((p) => p.stageId === stage.id) ||
    [];

  // Sort performances by start time
  stagePerformances.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  colDiv.innerHTML = `
        <div class="stage-card">
            <div class="stage-header ${getStageClass(stage.name)}">
                <h3 class="stage-name">${stage.name}</h3>
                <div class="stage-info">
                    <span>${stage.location}</span>
                    <span>Capacity: ${stage.capacity.toLocaleString()}</span>
                </div>
            </div>
            <div class="stage-content">
                ${
                  stagePerformances.length > 0
                    ? `
                    <ul class="stage-performances">
                        ${stagePerformances
                          .map((performance) => {
                            const artist = getArtistById(performance.artistId);
                            return `
                                <li class="stage-performance-item" data-performance-id="${
                                  performance.id
                                }">
                                    <div class="stage-performance-time">${
                                      performance.startTime
                                    } - ${performance.endTime}</div>
                                    <div class="stage-performance-artist">${
                                      artist ? artist.name : "Unknown Artist"
                                    }</div>
                                    <div class="stage-performance-description">${
                                      performance.description || ""
                                    }</div>
                                </li>
                            `;
                          })
                          .join("")}
                    </ul>
                `
                    : `
                    <div class="empty-schedule">
                        <i class="fas fa-calendar-times fa-2x mb-3"></i>
                        <p>No performances scheduled</p>
                    </div>
                `
                }
            </div>
        </div>
    `;

  // Add click events for performance items
  const performanceItems = colDiv.querySelectorAll(".stage-performance-item");
  performanceItems.forEach((item) => {
    item.addEventListener("click", function () {
      const performanceId = parseInt(item.dataset.performanceId);
      const performance = findPerformanceById(performanceId);
      if (performance) {
        showPerformanceDetail(performance);
      }
    });
  });

  return colDiv;
}

/**
 * Initialize Event Listeners for Schedule Page
 */
function initializeScheduleEventListeners() {
  // View toggle (Timeline/Stage)
  const timelineViewBtn = document.getElementById("timelineView");
  const stageViewBtn = document.getElementById("stageView");

  if (timelineViewBtn && stageViewBtn) {
    timelineViewBtn.addEventListener("change", function () {
      document.querySelectorAll(".timeline-view").forEach((el) => {
        el.style.display = "block";
      });
      document.querySelectorAll(".stage-view").forEach((el) => {
        el.style.display = "none";
      });
    });

    stageViewBtn.addEventListener("change", function () {
      document.querySelectorAll(".timeline-view").forEach((el) => {
        el.style.display = "none";
      });
      document.querySelectorAll(".stage-view").forEach((el) => {
        el.style.display = "block";
      });
    });
  }

  // Day tab changes
  const tabs = document.querySelectorAll("#scheduleDaysTabs .nav-link");
  tabs.forEach((tab) => {
    tab.addEventListener("shown.bs.tab", function () {
      // When tab changes, ensure the correct view (timeline/stage) is shown
      const isTimelineSelected =
        document.getElementById("timelineView").checked;
      const isStageSelected = document.getElementById("stageView").checked;

      const dayId = tab.getAttribute("aria-controls");

      if (isTimelineSelected) {
        document.getElementById(`${dayId}TimelineView`).style.display = "block";
        document.getElementById(`${dayId}StageView`).style.display = "none";
      } else if (isStageSelected) {
        document.getElementById(`${dayId}TimelineView`).style.display = "none";
        document.getElementById(`${dayId}StageView`).style.display = "block";
      }
    });
  });

  // Search input
  const searchInput = document.getElementById("scheduleSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.toLowerCase().trim();

      if (searchTerm === "") {
        // Reset all views if search is cleared
        document
          .querySelectorAll(".performance-card, .stage-performance-item")
          .forEach((el) => {
            el.style.display = "";
          });
        return;
      }

      // Filter performance cards in timeline view
      document.querySelectorAll(".performance-card").forEach((card) => {
        const artistName = card
          .querySelector(".performance-artist")
          .textContent.toLowerCase();
        const description = card
          .querySelector(".performance-description")
          .textContent.toLowerCase();

        if (
          artistName.includes(searchTerm) ||
          description.includes(searchTerm)
        ) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });

      // Filter performance items in stage view
      document.querySelectorAll(".stage-performance-item").forEach((item) => {
        const artistName = item
          .querySelector(".stage-performance-artist")
          .textContent.toLowerCase();
        const description = item
          .querySelector(".stage-performance-description")
          .textContent.toLowerCase();

        if (
          artistName.includes(searchTerm) ||
          description.includes(searchTerm)
        ) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
}

/**
 * Find Performance by ID
 * @param {Number} performanceId - Performance ID
 * @return {Object|null} Performance object or null if not found
 */
function findPerformanceById(performanceId) {
  for (const day of schedule) {
    const performance = day.performances.find((p) => p.id === performanceId);
    if (performance) {
      return {
        ...performance,
        day: day.day,
        date: day.date,
      };
    }
  }
  return null;
}

/**
 * Show Performance Detail Modal
 * @param {Object} performance - Performance object
 */
function showPerformanceDetail(performance) {
  const artist = getArtistById(performance.artistId);
  const stage = getStageById(performance.stageId);

  if (!artist || !stage) return;

  // Populate modal content
  const modalContent = document.getElementById("performanceDetailContent");
  if (!modalContent) return;

  modalContent.innerHTML = `
        <div class="performance-detail-header">
            <div class="performance-detail-artist-image">
                <img src="${
                  artist.image || "../assets/images/ui/artist-placeholder.jpg"
                }" alt="${artist.name}">
            </div>
            <div class="performance-detail-titles">
                <h4>${artist.name}</h4>
                <div class="performance-detail-stage ${getStageClass(
                  stage.name
                )}">${stage.name}</div>
            </div>
        </div>
        
        <div class="performance-detail-info">
            <div class="info-item">
                <div class="info-label">Day:</div>
                <div class="info-value">${performance.day || ""}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Date:</div>
                <div class="info-value">${performance.date || ""}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Time:</div>
                <div class="info-value">${performance.startTime} - ${
    performance.endTime
  }</div>
            </div>
            <div class="info-item">
                <div class="info-label">Location:</div>
                <div class="info-value">${stage.location}</div>
            </div>
        </div>
        
        ${
          performance.description
            ? `
            <div class="performance-detail-description">
                ${performance.description}
            </div>
        `
            : ""
        }
    `;

  // Store performance ID in modal for edit/delete actions
  const modal = document.getElementById("performanceDetailModal");
  modal.dataset.performanceId = performance.id;

  // Edit button event
  const editBtn = document.getElementById("editPerformanceBtn");
  if (editBtn) {
    editBtn.onclick = function () {
      editPerformance(performance);
    };
  }

  // Delete button event
  const deleteBtn = document.getElementById("deletePerformanceBtn");
  if (deleteBtn) {
    deleteBtn.onclick = function () {
      confirmDeletePerformance(performance);
    };
  }

  // Show modal
  const performanceModal = new bootstrap.Modal(modal);
  performanceModal.show();
}

/**
 * Handle Add Performance Form Submission
 */
function handleAddPerformanceForm() {
  const form = document.getElementById("addPerformanceForm");
  const performanceId = form.dataset.performanceId;

  // Get form values
  const day = document.getElementById("performanceDay").value;
  const artistId = parseInt(document.getElementById("performanceArtist").value);
  const stageId = parseInt(document.getElementById("performanceStage").value);
  const startTime = document.getElementById("performanceStartTime").value;
  const endTime = document.getElementById("performanceEndTime").value;
  const description = document
    .getElementById("performanceDescription")
    .value.trim();

  // Validate required fields
  if (!day || isNaN(artistId) || isNaN(stageId) || !startTime || !endTime) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate time (end time should be after start time)
  if (startTime >= endTime) {
    alert("End time must be after start time.");
    return;
  }

  // Find the day index in the schedule array
  const dayIndex = schedule.findIndex(
    (d) => d.day.toLowerCase() === day.toLowerCase()
  );
  if (dayIndex === -1) {
    alert("Invalid day selected.");
    return;
  }

  // Check for time conflicts with existing performances on the same stage
  const hasConflict = checkTimeConflict(
    dayIndex,
    stageId,
    startTime,
    endTime,
    performanceId ? parseInt(performanceId) : null
  );
  if (hasConflict) {
    alert(
      "There is a scheduling conflict with another performance on this stage. Please choose a different time or stage."
    );
    return;
  }

  // Create performance object
  const performanceData = {
    artistId,
    stageId,
    startTime,
    endTime,
    description,
  };

  // Check if adding new or editing existing
  if (performanceId) {
    // Edit existing performance
    performanceData.id = parseInt(performanceId);

    // Find and update the performance
    const performance = schedule[dayIndex].performances.find(
      (p) => p.id === performanceData.id
    );
    if (performance) {
      Object.assign(performance, performanceData);
      alert("Performance updated successfully!");
    }
  } else {
    // Add new performance
    // Generate new ID (in a real app, this would be handled by the backend)
    let maxId = 0;
    schedule.forEach((day) => {
      day.performances.forEach((perf) => {
        if (perf.id > maxId) maxId = perf.id;
      });
    });

    performanceData.id = maxId + 1;

    // Add to schedule
    schedule[dayIndex].performances.push(performanceData);
    alert("New performance added successfully!");
  }

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addPerformanceModal")
  );
  modal.hide();

  // Reset the form
  form.reset();
  delete form.dataset.performanceId;

  // Update views
  const dayId = day.toLowerCase();
  initializeTimelineView(dayId, dayIndex);
  initializeStageView(dayId, dayIndex);
}

/**
 * Check for Time Conflicts
 * @param {Number} dayIndex - Day index in schedule array
 * @param {Number} stageId - Stage ID
 * @param {String} startTime - New performance start time
 * @param {String} endTime - New performance end time
 * @param {Number|null} excludeId - Performance ID to exclude (for editing)
 * @return {Boolean} True if there's a conflict, false otherwise
 */
function checkTimeConflict(
  dayIndex,
  stageId,
  startTime,
  endTime,
  excludeId = null
) {
  // Filter performances for the same stage
  const stagePerformances = schedule[dayIndex].performances.filter(
    (p) => p.stageId === stageId && (excludeId === null || p.id !== excludeId)
  );

  // Convert times to minutes for easier comparison
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  // Check for overlaps
  for (const perf of stagePerformances) {
    const perfStart = timeToMinutes(perf.startTime);
    const perfEnd = timeToMinutes(perf.endTime);

    // Check if times overlap
    if (
      (newStart >= perfStart && newStart < perfEnd) || // New start time is during existing performance
      (newEnd > perfStart && newEnd <= perfEnd) || // New end time is during existing performance
      (newStart <= perfStart && newEnd >= perfEnd) // New performance completely contains existing one
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Convert Time String to Minutes
 * @param {String} timeStr - Time string in format "HH:MM"
 * @return {Number} Minutes since 00:00
 */
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Edit Performance
 * @param {Object} performance - Performance object
 */
function editPerformance(performance) {
  // Close detail modal
  const detailModal = bootstrap.Modal.getInstance(
    document.getElementById("performanceDetailModal")
  );
  detailModal.hide();

  // Get day from performance
  const day = performance.day;

  // Populate the add/edit form
  document.getElementById("performanceDay").value = day;
  document.getElementById("performanceArtist").value = performance.artistId;
  document.getElementById("performanceStage").value = performance.stageId;
  document.getElementById("performanceStartTime").value = performance.startTime;
  document.getElementById("performanceEndTime").value = performance.endTime;
  document.getElementById("performanceDescription").value =
    performance.description || "";

  // Update modal title
  const modalTitle = document.querySelector(
    "#addPerformanceModal .modal-title"
  );
  modalTitle.textContent = "Edit Performance";

  // Store performance ID in the form for update
  const form = document.getElementById("addPerformanceForm");
  form.dataset.performanceId = performance.id;

  // Update save button text
  const saveBtn = document.getElementById("savePerformanceBtn");
  saveBtn.textContent = "Update Performance";

  // Show the modal
  const modal = new bootstrap.Modal(
    document.getElementById("addPerformanceModal")
  );
  modal.show();
}

/**
 * Confirm Delete Performance
 * @param {Object} performance - Performance object
 */
function confirmDeletePerformance(performance) {
  // Close detail modal
  const detailModal = bootstrap.Modal.getInstance(
    document.getElementById("performanceDetailModal")
  );
  detailModal.hide();

  // Get artist and stage info
  const artist = getArtistById(performance.artistId);
  const stage = getStageById(performance.stageId);

  if (!artist || !stage) return;

  // Create confirmation modal HTML
  const modalHtml = `
        <div class="modal fade" id="deletePerformanceConfirmModal" tabindex="-1" aria-labelledby="deletePerformanceConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deletePerformanceConfirmModalLabel">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete the performance:</p>
                        <div class="alert alert-info">
                            <strong>${artist.name}</strong><br>
                            ${stage.name}<br>
                            ${performance.day}, ${performance.startTime} - ${performance.endTime}
                        </div>
                        <p class="text-danger">This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmDeletePerformanceBtn">Delete Performance</button>
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
  const modalElement = document.getElementById("deletePerformanceConfirmModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById(
    "confirmDeletePerformanceBtn"
  );
  confirmDeleteBtn.addEventListener("click", function () {
    // Find the day index in the schedule array
    const dayIndex = schedule.findIndex((d) => d.day === performance.day);
    if (dayIndex !== -1) {
      // Find and remove the performance
      const perfIndex = schedule[dayIndex].performances.findIndex(
        (p) => p.id === performance.id
      );
      if (perfIndex !== -1) {
        schedule[dayIndex].performances.splice(perfIndex, 1);

        // Update views
        const dayId = performance.day.toLowerCase();
        initializeTimelineView(dayId, dayIndex);
        initializeStageView(dayId, dayIndex);

        // Show success message
        alert("Performance deleted successfully!");
      }
    }

    // Close modal
    modal.hide();
  });

  // Clean up when modal is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Reset Add Performance Form
 */
function resetAddPerformanceForm() {
  const form = document.getElementById("addPerformanceForm");
  if (!form) return;

  // Clear form inputs
  form.reset();

  // Clear performance ID if it was set for editing
  delete form.dataset.performanceId;

  // Reset modal title
  const modalTitle = document.querySelector(
    "#addPerformanceModal .modal-title"
  );
  if (modalTitle) modalTitle.textContent = "Add New Performance";

  // Reset save button text
  const saveBtn = document.getElementById("savePerformanceBtn");
  if (saveBtn) saveBtn.textContent = "Save Performance";
}

// Initialize "add performance" modal reset when closed
document.addEventListener("DOMContentLoaded", function () {
  const addPerformanceModal = document.getElementById("addPerformanceModal");
  if (addPerformanceModal) {
    addPerformanceModal.addEventListener(
      "hidden.bs.modal",
      resetAddPerformanceForm
    );
  }
});
