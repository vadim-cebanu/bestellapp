const cartContainer = document.getElementById('cart-container');
const cartBtn = document.getElementById('cart-btn');
const cartItems = document.getElementById('cart-items');
const totalNumberOfItems = document.getElementById('total-items');
const cartSubTotal = document.getElementById('subtotal');
const deliveryFeeAmount = document.getElementById('delivery-fee-amount');
const deliveryFeeRow = document.getElementById('delivery-fee-row');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartBadge = document.getElementById('cart-badge');
const cartOverlay = document.getElementById('cart-overlay');
const mobileCartBar = document.getElementById('mobile-cart-bar');
const mobileCartPrice = document.getElementById('mobile-cart-price');

const splashScreen = document.getElementById('splash-screen');
const splashContainer = document.querySelector('.splash-container');

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        splashContainer.classList.add('active');
    }, 500);

    setTimeout(() => {
        splashContainer.classList.add('moving-to-header');
    }, 3500);

    setTimeout(() => {
        splashScreen.style.display = 'none';
    }, 5000);
});

class CartItem {
    constructor() {
        this.items = {};
        this.deliveryType = 'delivery';
        this.deliveryFee = 5;
        this.total = 5;
    }

    setDeliveryType(type) {
        this.deliveryType = type;
        this.deliveryFee = type === 'delivery' ? 5 : 0;

        if (deliveryFeeAmount) {
            deliveryFeeAmount.textContent = `${this.deliveryFee.toFixed(2)}?`;
        }

        if (deliveryFeeRow) {
            deliveryFeeRow.style.display = type === 'delivery' ? 'flex' : 'none';
        }

        this.calculateTotal();
    }

    addItem(id, products) {
        const product = products.find(item => item.id === id);
        if (!product) return;

        this.updateItemQuantity(id, product);
        this.updateCart();
        showNotification(`+ ${product.name} added to cart!`, 'success');
    }

    updateItemQuantity(id, product) {
        if (this.items[id]) {
            this.items[id].quantity += 1;
        } else {
            this.items[id] = { ...product, quantity: 1 };
        }
    }

    updateCart() {
        this.renderCart();
        this.calculateTotal();
    }

    removeItem(id) {
        if (this.items[id] && this.items[id].quantity > 1) {
            this.items[id].quantity -= 1;
        } else {
            delete this.items[id];
        }
        this.updateCart();
    }

    deleteItem(id) {
        delete this.items[id];
        this.updateCart();
    }

    renderCart() {
        cartItems.innerHTML = '';
        const itemsArray = Object.values(this.items);

        if (itemsArray.length === 0) {
            this.showEmptyCart();
            return;
        }

        itemsArray.forEach(item => this.renderCartItem(item));
        this.updateBadge();
    }

    showEmptyCart() {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        this.updateBadge();
        this.calculateTotal();
    }

    renderCartItem(item) {
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

    updateBadge() {
        const count = this.getCounts();
        totalNumberOfItems.textContent = count;
        cartBadge.textContent = count;

        if (count > 0) {
            cartBadge.classList.add('show');
        } else {
            cartBadge.classList.remove('show');
        }

        if (mobileCartBar) {
            mobileCartBar.classList.remove('hidden');
        }
    }

    getCounts() {
        return Object.values(this.items).reduce((sum, item) => sum + item.quantity, 0);
    }

    calculateTotal() {
        const subtotal = Object.values(this.items).reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        this.total = subtotal + this.deliveryFee;

        if (cartSubTotal) {
            cartSubTotal.textContent = `${this.total.toFixed(2)}€`;
        }

        if (mobileCartPrice) {
            mobileCartPrice.textContent = `${this.total.toFixed(2)}€`;
        }
    }

    clearCart() {
        this.items = {};
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        this.total = this.deliveryFee;

        if (cartSubTotal) {
            cartSubTotal.textContent = `${this.total.toFixed(2)}€`;
        }
        totalNumberOfItems.textContent = '0';
        cartBadge.textContent = '0';
        cartBadge.classList.remove('show');

        if (mobileCartPrice) {
            mobileCartPrice.textContent = `${this.total.toFixed(2)}€`;
        }
    }
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

const cart = new CartItem();

function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function setBodyModalState(enabled) {
    if (enabled) {
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open');
    }
}

function openCart() {
    cartContainer.classList.remove('hidden');
    if (cartOverlay && isMobileView()) {
        cartOverlay.classList.add('active');
    }
    if (isMobileView()) {
        setBodyModalState(true);
    }
}

function closeCart() {
    cartContainer.classList.add('hidden');
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
    if (isMobileView()) {
        setBodyModalState(false);
    }
}

if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
        if (cartContainer.classList.contains('hidden')) {
            openCart();
        } else {
            closeCart();
        }
    });
}

if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
        closeCart();
    });
}

if (mobileCartBar) {
    mobileCartBar.addEventListener('click', () => {
        if (cartContainer.classList.contains('hidden')) {
            openCart();
        } else {
            closeCart();
        }
    });
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
        closeCart();
    });
}

const deliveryBtns = document.querySelectorAll('.delivery-btn');
deliveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        deliveryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cart.setDeliveryType(btn.dataset.type);
    });
});

setTimeout(() => {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            cart.addItem(index + 1, products);
            totalNumberOfItems.textContent = cart.getCounts();
            cart.calculateTotal();
        });
    });
}, 100);

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        if (Object.keys(cart.items).length > 0) {
            showCheckoutModal(cart);
            setTimeout(() => cart.clearCart(), 500);
        } else {
            showNotification('Your cart is empty!', 'error');
        }
    });
}
