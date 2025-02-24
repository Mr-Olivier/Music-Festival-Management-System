/**
 * SoundWave Festival - Music Festival Management System
 * Main JavaScript File
 */

// DOM Ready Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeFeaturedArtists();
  initializeTodaySchedule();
  initializeEventListeners();
});

/**
 * Initialize Featured Artists widget on homepage
 */
function initializeFeaturedArtists() {
  const featuredArtistsContainer = document.getElementById("featuredArtists");
  if (!featuredArtistsContainer) return;

  // Filter for popular artists
  const popularArtists = artists.filter((artist) => artist.popular);

  // Clear loading indicator
  featuredArtistsContainer.innerHTML = "";

  // Add featured artists
  popularArtists.slice(0, 4).forEach((artist) => {
    const artistElement = createArtistElement(artist);
    featuredArtistsContainer.appendChild(artistElement);
  });
}

/**
 * Create Artist Element for widgets
 * @param {Object} artist - Artist data object
 * @return {HTMLElement} Artist element
 */
function createArtistElement(artist) {
  const artistElement = document.createElement("div");
  artistElement.className = "artist-item";

  artistElement.innerHTML = `
        <div class="artist-image">
            <img src="${artist.image}" alt="${artist.name}">
        </div>
        <div class="artist-info">
            <div class="artist-name">${artist.name}</div>
            <div class="artist-genre">${artist.genre}</div>
        </div>
    `;

  // Add click event to show artist details
  artistElement.addEventListener("click", () => {
    showArtistModal(artist);
  });

  return artistElement;
}

/**
 * Show Artist Details Modal
 * @param {Object} artist - Artist data object
 */
function showArtistModal(artist) {
  // Create modal HTML
  const modalHtml = `
        <div class="modal fade" id="artistModal" tabindex="-1" aria-labelledby="artistModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="artistModalLabel">${
                          artist.name
                        }</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${artist.image}" alt="${
    artist.name
  }" class="img-fluid rounded">
                                <div class="mt-3">
                                    <span class="badge bg-primary">${
                                      artist.genre
                                    }</span>
                                </div>
                                <div class="mt-3">
                                    <a href="#" class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" class="btn btn-sm btn-outline-primary me-1">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" class="btn btn-sm btn-outline-primary">
                                        <i class="fab fa-spotify"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h6>Biography</h6>
                                <p>${artist.bio}</p>
                                
                                <h6 class="mt-4">Performances</h6>
                                <div id="artistPerformances">
                                    ${getArtistPerformancesHtml(artist.id)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Edit Artist</button>
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
  const modalElement = document.getElementById("artistModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Clean up when modal is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Get HTML for artist performances
 * @param {Number} artistId - Artist ID
 * @return {String} HTML for performances
 */
function getArtistPerformancesHtml(artistId) {
  let performancesHtml = "";
  let hasPerformances = false;

  // Loop through schedule to find performances
  schedule.forEach((day) => {
    const artistPerformances = day.performances.filter(
      (p) => p.artistId === artistId
    );

    if (artistPerformances.length > 0) {
      hasPerformances = true;

      performancesHtml += `
                <div class="performance-day mb-3">
                    <h6 class="performance-date">${day.day} - ${day.date}</h6>
                    <ul class="list-group">
            `;

      artistPerformances.forEach((performance) => {
        const stage = getStageById(performance.stageId);

        performancesHtml += `
                    <li class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold">${performance.startTime} - ${performance.endTime}</span>
                                <div class="text-muted">${stage.name}</div>
                            </div>
                            <span class="badge bg-primary rounded-pill">${performance.description}</span>
                        </div>
                    </li>
                `;
      });

      performancesHtml += `
                    </ul>
                </div>
            `;
    }
  });

  if (!hasPerformances) {
    performancesHtml = '<p class="text-muted">No scheduled performances.</p>';
  }

  return performancesHtml;
}

/**
 * Initialize Today's Schedule widget on homepage
 */
function initializeTodaySchedule() {
  const scheduleContainer = document.getElementById("todaySchedule");
  if (!scheduleContainer) return;

  // Get today's schedule (for demo using Friday)
  const todaySchedule = getTodaySchedule();

  // Clear loading indicator
  scheduleContainer.innerHTML = "";

  // Add date header
  const dateHeader = document.createElement("div");
  dateHeader.className = "schedule-date mb-3";
  dateHeader.innerHTML = `<h6>${todaySchedule.day} - ${todaySchedule.date}</h6>`;
  scheduleContainer.appendChild(dateHeader);

  // Sort performances by start time
  const sortedPerformances = [...todaySchedule.performances].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Add performances (limit to 5 for the widget)
  sortedPerformances.slice(0, 5).forEach((performance) => {
    const artist = getArtistById(performance.artistId);
    const stage = getStageById(performance.stageId);

    const performanceElement = document.createElement("div");
    performanceElement.className = "schedule-item";

    performanceElement.innerHTML = `
            <div class="schedule-time">${performance.startTime} - ${performance.endTime}</div>
            <div class="schedule-artist">${artist.name}</div>
            <div class="schedule-stage">${stage.name}</div>
        `;

    scheduleContainer.appendChild(performanceElement);
  });
}

/**
 * Initialize Event Listeners
 */
function initializeEventListeners() {
  // Search functionality
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          // For demo, alert the search query
          alert(
            `Search for: ${query}\n\nIn a real application, this would navigate to search results.`
          );
        }
      }
    });
  }

  // Ticket purchase simulation
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-buy-ticket") ||
      e.target.closest(".btn-buy-ticket")
    ) {
      const ticketId = e.target.closest("[data-ticket-id]")?.dataset.ticketId;
      if (ticketId) {
        showTicketPurchaseModal(parseInt(ticketId));
      }
    }
  });

  // Add to cart simulation
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-add-cart") ||
      e.target.closest(".btn-add-cart")
    ) {
      const ticketId = e.target.closest("[data-ticket-id]")?.dataset.ticketId;
      if (ticketId) {
        showAddToCartNotification(parseInt(ticketId));
      }
    }
  });
}

/**
 * Show Ticket Purchase Modal
 * @param {Number} ticketId - Ticket ID
 */
function showTicketPurchaseModal(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return;

  // Create modal HTML
  const modalHtml = `
        <div class="modal fade" id="purchaseModal" tabindex="-1" aria-labelledby="purchaseModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="purchaseModalLabel">Purchase Ticket</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="ticket-details mb-4">
                            <h5>${ticket.name}</h5>
                            <p class="text-muted">${ticket.description}</p>
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Price:</span>
                                <span>${ticket.price.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Available:</span>
                                <span>${
                                  ticket.available - ticket.sold
                                } tickets</span>
                            </div>
                        </div>
                        
                        <form id="purchaseForm">
                            <div class="mb-3">
                                <label for="quantity" class="form-label">Quantity</label>
                                <select class="form-select" id="quantity">
                                    ${Array.from(
                                      {
                                        length: Math.min(
                                          ticket.maxPerPurchase,
                                          ticket.available - ticket.sold
                                        ),
                                      },
                                      (_, i) => i + 1
                                    )
                                      .map(
                                        (num) =>
                                          `<option value="${num}">${num}</option>`
                                      )
                                      .join("")}
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="name" value="${
                                  userProfile.name
                                }">
                            </div>
                            
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" value="${
                                  userProfile.email
                                }">
                            </div>
                            
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="termsCheck" checked>
                                    <label class="form-check-label" for="termsCheck">
                                        I agree to the terms and conditions
                                    </label>
                                </div>
                            </div>
                        </form>
                        
                        <div class="purchase-summary">
                            <h6>Order Summary</h6>
                            <div class="d-flex justify-content-between">
                                <span>${
                                  ticket.name
                                } x <span id="summaryQuantity">1</span></span>
                                <span id="summaryPrice">${ticket.price.toFixed(
                                  2
                                )}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span id="summaryTotal">${ticket.price.toFixed(
                                  2
                                )}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="completePurchase">Complete Purchase</button>
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
  const modalElement = document.getElementById("purchaseModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Update summary when quantity changes
  const quantitySelect = document.getElementById("quantity");
  quantitySelect.addEventListener("change", function () {
    const quantity = parseInt(this.value);
    const summaryQuantity = document.getElementById("summaryQuantity");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryTotal = document.getElementById("summaryTotal");

    summaryQuantity.textContent = quantity;
    summaryPrice.textContent = `${(ticket.price * quantity).toFixed(2)}`;
    summaryTotal.textContent = `${(ticket.price * quantity).toFixed(2)}`;
  });

  // Complete purchase button
  const completePurchaseBtn = document.getElementById("completePurchase");
  completePurchaseBtn.addEventListener("click", function () {
    // Simulate purchase completion
    modal.hide();
    showPurchaseConfirmation(ticket);
  });

  // Clean up when modal is hidden
  modalElement.addEventListener("hidden.bs.modal", function () {
    modalElement.remove();
  });
}

/**
 * Show Purchase Confirmation
 * @param {Object} ticket - Ticket object
 */
function showPurchaseConfirmation(ticket) {
  // Create toast notification
  const toastHtml = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
            <div class="toast" id="purchaseToast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong class="me-auto">Purchase Successful!</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    <p>Thank you for purchasing <strong>${ticket.name}</strong>!</p>
                    <p class="mb-0">A confirmation email has been sent to your inbox.</p>
                </div>
            </div>
        </div>
    `;

  // Append toast to body
  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = toastHtml;
  document.body.appendChild(toastContainer);

  // Initialize and show toast
  const toastElement = document.getElementById("purchaseToast");
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 5000,
  });
  toast.show();

  // Clean up when toast is hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastContainer.remove();
  });
}

/**
 * Show Add to Cart Notification
 * @param {Number} ticketId - Ticket ID
 */
function showAddToCartNotification(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return;

  // Create toast notification
  const toastHtml = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
            <div class="toast" id="cartToast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-primary text-white">
                    <i class="fas fa-shopping-cart me-2"></i>
                    <strong class="me-auto">Added to Cart</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    <p class="mb-2"><strong>${ticket.name}</strong> has been added to your cart.</p>
                    <div class="d-flex justify-content-between">
                        <a href="#" class="btn btn-sm btn-outline-primary">View Cart</a>
                        <a href="#" class="btn btn-sm btn-primary">Checkout</a>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Append toast to body
  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = toastHtml;
  document.body.appendChild(toastContainer);

  // Initialize and show toast
  const toastElement = document.getElementById("cartToast");
  const toast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 5000,
  });
  toast.show();

  // Clean up when toast is hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastContainer.remove();
  });
}
