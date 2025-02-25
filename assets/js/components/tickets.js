/**
 * Update Cart Display
 */
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCart = document.querySelector(".empty-cart");
  const cartTotals = document.querySelector(".cart-totals");
  const cartActions = document.getElementById("cartActions");
  const cartItemCount = document.getElementById("cartItemCount");

  if (
    !cartItemsContainer ||
    !emptyCart ||
    !cartTotals ||
    !cartActions ||
    !cartItemCount
  )
    return;

  // Update cart item count
  const totalItems = cart.items.reduce(
    (count, item) => count + item.quantity,
    0
  );
  cartItemCount.textContent = totalItems;

  if (cart.items.length === 0) {
    // Show empty cart message
    emptyCart.style.display = "block";
    cartItemsContainer.style.display = "none";
    cartTotals.style.display = "none";
    cartActions.style.display = "none";
    return;
  }

  // Hide empty cart message, show cart items and totals
  emptyCart.style.display = "none";
  cartItemsContainer.style.display = "block";
  cartTotals.style.display = "block";
  cartActions.style.display = "block";

  // Clear existing items
  cartItemsContainer.innerHTML = "";

  // Add items to cart display
  cart.items.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(
                  2
                )} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="cart-item-quantity-btn decrease-quantity" data-ticket-id="${
                  item.ticketId
                }">-</button>
                <span class="cart-item-quantity-value">${item.quantity}</span>
                <button class="cart-item-quantity-btn increase-quantity" data-ticket-id="${
                  item.ticketId
                }">+</button>
            </div>
            <div class="cart-item-total">$${(
              item.price * item.quantity
            ).toFixed(2)}</div>
            <div class="cart-item-remove" data-ticket-id="${item.ticketId}">
                <i class="fas fa-times"></i>
            </div>
        `;

    cartItemsContainer.appendChild(cartItemDiv);

    // Add event listeners
    cartItemDiv
      .querySelector(".decrease-quantity")
      .addEventListener("click", function () {
        decreaseItemQuantity(item.ticketId);
      });

    cartItemDiv
      .querySelector(".increase-quantity")
      .addEventListener("click", function () {
        increaseItemQuantity(item.ticketId);
      });

    cartItemDiv
      .querySelector(".cart-item-remove")
      .addEventListener("click", function () {
        removeFromCart(item.ticketId);
      });
  });

  // Update totals display
  document.getElementById(
    "cartSubtotal"
  ).textContent = `$${cart.subtotal.toFixed(2)}`;
  document.getElementById("cartFees").textContent = `$${cart.fees.toFixed(2)}`;
  document.getElementById("cartTotal").textContent = `$${cart.total.toFixed(
    2
  )}`;
}

/**
 * Decrease Item Quantity in Cart
 * @param {Number} ticketId - Ticket ID
 */
function decreaseItemQuantity(ticketId) {
  const item = cart.items.find((item) => item.ticketId === ticketId);

  if (item && item.quantity > 1) {
    item.quantity--;
    updateCartTotals();
    updateCartDisplay();
  }
}

/**
 * Increase Item Quantity in Cart
 * @param {Number} ticketId - Ticket ID
 */
function increaseItemQuantity(ticketId) {
  const item = cart.items.find((item) => item.ticketId === ticketId);
  const ticket = tickets.find((t) => t.id === ticketId);

  if (item && ticket) {
    // Check if we can increase quantity (within available tickets and max per purchase)
    const remaining = ticket.available - ticket.sold;
    const maxPerPurchase = ticket.maxPerPurchase;

    if (item.quantity < Math.min(remaining, maxPerPurchase)) {
      item.quantity++;
      updateCartTotals();
      updateCartDisplay();
    } else {
      alert(
        `Sorry, you can't add more of this ticket type. Maximum allowed is ${Math.min(
          remaining,
          maxPerPurchase
        )}.`
      );
    }
  }
}

/**
 * Remove Item from Cart
 * @param {Number} ticketId - Ticket ID
 */
function removeFromCart(ticketId) {
  const index = cart.items.findIndex((item) => item.ticketId === ticketId);

  if (index !== -1) {
    cart.items.splice(index, 1);
    updateCartTotals();
    updateCartDisplay();
  }
}

/**
 * Clear the Cart
 */
function clearCart() {
  cart.items = [];
  updateCartTotals();
  updateCartDisplay();
}

/**
 * Show Add to Cart Notification
 * @param {Object} ticket - Ticket object
 * @param {Number} quantity - Quantity added
 */
function showAddToCartNotification(ticket, quantity) {
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
                    <p class="mb-2"><strong>${quantity}x ${ticket.name}</strong> has been added to your cart.</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary" data-bs-dismiss="toast">Continue Shopping</button>
                        <button class="btn btn-sm btn-primary" id="viewCartBtn">View Cart</button>
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

  // View cart button
  const viewCartBtn = document.getElementById("viewCartBtn");
  viewCartBtn.addEventListener("click", function () {
    toast.hide();
    document.getElementById("cartItems").scrollIntoView({ behavior: "smooth" });
  });

  // Clean up when toast is hidden
  toastElement.addEventListener("hidden.bs.toast", function () {
    toastContainer.remove();
  });
}

/**
 * Show Checkout Modal
 */
function showCheckoutModal() {
  if (cart.items.length === 0) {
    alert("Your cart is empty. Please add tickets before checkout.");
    return;
  }

  // Update checkout items
  updateCheckoutItems();

  // Show the modal
  const checkoutModal = new bootstrap.Modal(
    document.getElementById("checkoutModal")
  );
  checkoutModal.show();
}

/**
 * Update Checkout Items
 */
function updateCheckoutItems() {
  const checkoutItemsContainer = document.getElementById("checkoutItems");
  if (!checkoutItemsContainer) return;

  // Clear existing items
  checkoutItemsContainer.innerHTML = "";

  // Add items to checkout display
  cart.items.forEach((item) => {
    const checkoutItemDiv = document.createElement("div");
    checkoutItemDiv.className = "checkout-item";
    checkoutItemDiv.innerHTML = `
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-price">$${item.price.toFixed(
                  2
                )} each</div>
            </div>
            <div class="checkout-item-quantity">
                ${item.quantity}x
            </div>
            <div class="checkout-item-total">$${(
              item.price * item.quantity
            ).toFixed(2)}</div>
        `;

    checkoutItemsContainer.appendChild(checkoutItemDiv);
  });

  // Update totals display
  document.getElementById(
    "checkoutSubtotal"
  ).textContent = `$${cart.subtotal.toFixed(2)}`;
  document.getElementById("checkoutFees").textContent = `$${cart.fees.toFixed(
    2
  )}`;
  document.getElementById("checkoutTotal").textContent = `$${cart.total.toFixed(
    2
  )}`;
}

/**
 * Complete Checkout
 */
function completeCheckout() {
  // In a real application, this would send data to the server and process payment
  // For the demo, we'll just update ticket quantities and show a confirmation

  // Update ticket quantities
  cart.items.forEach((item) => {
    const ticket = tickets.find((t) => t.id === item.ticketId);
    if (ticket) {
      ticket.sold += item.quantity;
    }
  });

  // Set order details in confirmation modal
  document.getElementById("confirmationOrderNumber").textContent =
    "SW-" + Math.floor(10000 + Math.random() * 90000);
  document.getElementById("confirmationDate").textContent =
    new Date().toLocaleDateString();
  document.getElementById(
    "confirmationAmount"
  ).textContent = `$${cart.total.toFixed(2)}`;

  // Close checkout modal
  const checkoutModal = bootstrap.Modal.getInstance(
    document.getElementById("checkoutModal")
  );
  checkoutModal.hide();

  // Show confirmation modal
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("purchaseConfirmationModal")
  );
  confirmationModal.show();

  // Clear cart
  clearCart();

  // Update ticket display (to reflect new quantities)
  renderTicketTypes();

  // Update sales statistics
  initializeSalesStats();
}

/**
 * Reset Add Ticket Form
 */
function resetAddTicketForm() {
  const form = document.getElementById("addTicketForm");
  if (!form) return;

  // Clear form inputs
  form.reset();

  // Clear features list
  document.getElementById("featureList").innerHTML = "";

  // Clear ticket ID if it was set for editing
  delete form.dataset.ticketId;

  // Reset modal title
  const modalTitle = document.querySelector("#addTicketModal .modal-title");
  if (modalTitle) modalTitle.textContent = "Add New Ticket Type";

  // Reset save button text
  const saveBtn = document.getElementById("saveTicketBtn");
  if (saveBtn) saveBtn.textContent = "Save Ticket";
}

// Initialize "add ticket" modal reset when closed
document.addEventListener("DOMContentLoaded", function () {
  const addTicketModal = document.getElementById("addTicketModal");
  if (addTicketModal) {
    addTicketModal.addEventListener("hidden.bs.modal", resetAddTicketForm);
  }
});


/**
 * Handle Add Ticket Form Submission
 */
function handleAddTicketForm() {
  const form = document.getElementById('addTicketForm');
  const ticketId = form.dataset.ticketId;
  
  // Get form values
  const ticketName = document.getElementById('ticketName').value.trim();
  const ticketPrice = parseFloat(document.getElementById('ticketPrice').value);
  const ticketAvailable = parseInt(document.getElementById('ticketAvailable').value);
  const ticketMaxPerPurchase = parseInt(document.getElementById('ticketMaxPerPurchase').value);
  const ticketDescription = document.getElementById('ticketDescription').value.trim();
  
  // Get features
  const features = [];
  document.querySelectorAll('#featureList .feature-tag').forEach(tag => {
      features.push(tag.querySelector('span').textContent);
  });
  
  // Validate required fields
  if (!ticketName || isNaN(ticketPrice) || isNaN(ticketAvailable) || isNaN(ticketMaxPerPurchase) || !ticketDescription) {
      alert('Please fill in all required fields.');
      return;
  }
  
  // Create ticket object
  const ticketData = {
      name: ticketName,
      description: ticketDescription,
      price: ticketPrice,
      available: ticketAvailable,
      sold: 0,
      maxPerPurchase: ticketMaxPerPurchase,
      features: features
  };
  
  // Check if adding new or editing existing
  if (ticketId) {
      // Edit existing ticket
      ticketData.id = parseInt(ticketId);
      
      // Find and update the ticket
      const index = tickets.findIndex(t => t.id === ticketData.id);
      if (index !== -1) {
          // Preserve sold tickets
          ticketData.sold = tickets[index].sold;
          tickets[index] = ticketData;
          alert('Ticket updated successfully!');
      }
  } else {
      // Add new ticket
      // Generate new ID
      const newId = Math.max(...tickets.map(t => t.id)) + 1;
      ticketData.id = newId;
      
      // Add to tickets array
      tickets.push(ticketData);
      alert('New ticket added successfully!');
  }
  
  // Close the modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('addTicketModal'));
  modal.hide();
  
  // Reset the form
  form.reset();
  document.getElementById('featureList').innerHTML = '';
  delete form.dataset.ticketId;
  
  // Update ticket display
  renderTicketTypes();
  
  // Update sales statistics
  initializeSalesStats();
}

/**
* Add Feature to Feature List
*/
function addFeature() {
  const featureInput = document.querySelector('.feature-input');
  const featureList = document.getElementById('featureList');
  
  if (featureInput && featureList && featureInput.value.trim() !== '') {
      const featureText = featureInput.value.trim();
      
      const featureTag = document.createElement('div');
      featureTag.className = 'feature-tag';
      featureTag.innerHTML = `
          <span>${featureText}</span>
          <span class="remove-feature"><i class="fas fa-times"></i></span>
      `;
      
      // Add click event to remove feature
      featureTag.querySelector('.remove-feature').addEventListener('click', function() {
          featureTag.remove();
      });
      
      featureList.appendChild(featureTag);
      featureInput.value = '';
      featureInput.focus();
  }
}

/**
* Reset Add Ticket Form
*/
function resetAddTicketForm() {
  const form = document.getElementById('addTicketForm');
  if (!form) return;
  
  // Clear form inputs
  form.reset();
  
  // Clear features list
  document.getElementById('featureList').innerHTML = '';
  
  // Clear ticket ID if it was set for editing
  delete form.dataset.ticketId;
  
  // Reset modal title
  const modalTitle = document.querySelector('#addTicketModal .modal-title');
  if (modalTitle) modalTitle.textContent = 'Add New Ticket Type';
  
  // Reset save button text
  const saveBtn = document.getElementById('saveTicketBtn');
  if (saveBtn) saveBtn.textContent = 'Save Ticket';
}

// Make sure to add these event listeners when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add Ticket Modal Event Listeners
  const addTicketModal = document.getElementById('addTicketModal');
  if (addTicketModal) {
      addTicketModal.addEventListener('hidden.bs.modal', resetAddTicketForm);
  }
  
  // Feature Add Button Event Listener
  const addFeatureBtn = document.querySelector('.add-feature-btn');
  if (addFeatureBtn) {
      addFeatureBtn.addEventListener('click', addFeature);
  }
  
  // Save Ticket Button Event Listener
  const saveTicketBtn = document.getElementById('saveTicketBtn');
  if (saveTicketBtn) {
      saveTicketBtn.addEventListener('click', handleAddTicketForm);
  }
  
  // Form Enter Key Handling for Features
  const featureInput = document.querySelector('.feature-input');
  if (featureInput) {
      featureInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
              e.preventDefault();
              addFeature();
          }
      });
  }
});
