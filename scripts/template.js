const rollCards = document.getElementById('product-container'); 

function renderProductCards(products) {
    products.forEach(({
        id,
        name,
        price,
        image,
        description
    }) => {
        rollCards.innerHTML += `
        <div class="roll-card" data-id="${id}">
            <img src="./assets/img/${image}" alt="${name}" class="roll-image">
            <div class="roll-card-content">
                <h3 class="roll-name">${name}</h3>
                <p class="roll-description">${description}</p>
                <div class="roll-card-footer">
                    <p class="roll-price">${price.toFixed(2)}€</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
        `;
    });
}

function renderCartItem(item) {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    cartItems.innerHTML += `
        <div id="cart-item-${item.id}" class="cart-product">
            <div class="cart-product-info">
                <p class="cart-product-name">${item.name}</p>
                <p class="cart-product-price">${itemTotal}€</p>
            </div>
            <div class="cart-product-controls">
                <button class="cart-btn-minus" onclick="cart.removeItem(${item.id})">-</button>
                <span class="cart-quantity">${item.quantity}</span>
                <button class="cart-btn-plus" onclick="cart.addItem(${item.id}, products)">+</button>
                <button class="cart-btn-delete" onclick="cart.deleteItem(${item.id})">x</button>
            </div>
        </div>
    `;
}

function showEmptyCart() {
    cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getDeliveryDetails(cart) {
    const text = cart.deliveryType === 'delivery' ? 'Delivery' : 'Pickup';
    const info =
        cart.deliveryType === 'delivery'
            ? 'Your order will be delivered in 30-45 minutes.'
            : 'Your order will be ready for pickup in 15-20 minutes.';
    const feeHtml =
        cart.deliveryType === 'delivery'
            ? `<p><strong>Delivery Fee:</strong> ${cart.deliveryFee.toFixed(2)}€</p>`
            : '';
    return { text, info, feeHtml };
}

function createModalContent(cart) {
    const { text, info, feeHtml } = getDeliveryDetails(cart);
    return `
        <div class="modal-header">
            <h2>Order Confirmed</h2>
            <button class="modal-close" onclick="closeCheckoutModal(this)">x</button>
        </div>
        <div class="modal-body">
            <p><strong>Type:</strong> ${text}</p>
            <p><strong>Items:</strong> ${cart.getCounts()}</p>
            <p><strong>Subtotal:</strong> ${(cart.total - cart.deliveryFee).toFixed(2)}€</p>
            ${feeHtml}
            <hr>
            <p class="modal-total"><strong>Total:</strong> ${cart.total.toFixed(2)}€</p>
            <p class="modal-info">${info}</p>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" onclick="closeCheckoutModal(this)">Close</button>
        </div>
    `;
}

function showCheckoutModal(cart) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = createModalContent(cart);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.body.classList.add('modal-open');

    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            overlay.remove();
            document.body.classList.remove('modal-open');
        }
    });
}

function closeCheckoutModal(button) {
    const overlay = button.closest('.modal-overlay');
    if (overlay) {
        overlay.remove();
    }
    document.body.classList.remove('modal-open');
}

renderProductCards(products);
