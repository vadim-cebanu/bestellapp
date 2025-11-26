const cartData = {
    items: {},
    deliveryType: 'delivery',
    deliveryFee: 5,
    total: 5,
};

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

function addItemToCart(id, products) {
    const product = products.find(p => p.id === id);
    if (product) {
        updateItemQuantity(id, product);
        updateCart();
        showNotification(`+ ${product.name} added to cart!`, 'success');
    }
}

function removeItemFromCart(id) {
    if (cartData.items[id] && cartData.items[id].quantity > 1) {
        cartData.items[id].quantity -= 1;
    } else {
        delete cartData.items[id];
    }
    updateCart();
}

function deleteItemFromCart(id) {
    delete cartData.items[id];
    updateCart();
}

function clearTheCart() {
    cartData.items = {};
    showEmptyCart(); 
    calculateTotal();
    updateBadge();
}

function setDeliveryType(type) {
    cartData.deliveryType = type;
    cartData.deliveryFee = (type === 'delivery') ? 5 : 0;
    updateDeliveryDisplay(type);
    calculateTotal();
}

function updateItemQuantity(id, product) {
    if (cartData.items[id]) {
        cartData.items[id].quantity += 1;
    } else {
    cartData.items[id] = {
    id: product.id,
    name: product.name,
    price: product.price,
    img: product.image,
    quantity: 1
};    }
}

function updateCart() {
    renderCart();
    calculateTotal();
}

function renderCart() {
    cartItems.innerHTML = '';
    const itemsArray = Object.values(cartData.items);

    if (itemsArray.length === 0) {
        showEmptyCart();
    } else {
        itemsArray.forEach(item => renderCartItem(item));
    }
    updateBadge();
}

function calculateTotal() {
    const subtotal = Object.values(cartData.items).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartData.total = subtotal + cartData.deliveryFee;
    if (cartSubTotal) cartSubTotal.textContent = `${cartData.total.toFixed(2)}€`;
    if (mobileCartPrice) mobileCartPrice.textContent = `${cartData.total.toFixed(2)}€`;
}

function getCounts() {
    return Object.values(cartData.items).reduce((sum, item) => sum + item.quantity, 0);
}

function updateBadge() {
    const count = getCounts();
    if (totalNumberOfItems) totalNumberOfItems.textContent = count;
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.classList.toggle('show', count > 0);
    }
    if (mobileCartBar) {
        mobileCartBar.classList.toggle('hidden', count === 0);
    }
}

function updateDeliveryDisplay(type) {
    if (deliveryFeeAmount) {
        deliveryFeeAmount.textContent = `${cartData.deliveryFee.toFixed(2)}€`;
    }
    if (deliveryFeeRow) {
        deliveryFeeRow.style.display = (type === 'delivery') ? 'flex' : 'none';
    }
}

function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function setBodyModalState(enabled) {
    document.body.classList.toggle('modal-open', enabled);
}

function openCart() {
    if (cartContainer) cartContainer.classList.remove('hidden');
    if (cartOverlay && isMobileView()) cartOverlay.classList.add('active');
    if (isMobileView()) setBodyModalState(true);
}

function closeCart() {
    if (cartContainer) cartContainer.classList.add('hidden');
    if (cartOverlay) cartOverlay.classList.remove('active');
    if (isMobileView()) setBodyModalState(false);
}

function initializeEventListeners() {
    initializeCartToggles();
    initializeDeliveryButtonHandlers();
    initializeAddToCartHandler();
    initializeCheckoutButtonHandler();
}

function initializeCartToggles() {
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const mobileCartBar = document.getElementById('mobile-cart-bar');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartContainer = document.getElementById('cart-container'); 

    const toggleCartVisibility = () => cartContainer.classList.contains('hidden') ? openCart() : closeCart();

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCartVisibility);
    if (mobileCartBar) mobileCartBar.addEventListener('click', toggleCartVisibility);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
}

function initializeDeliveryButtonHandlers() {
    const deliveryBtns = document.querySelectorAll('.delivery-btn');
    deliveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    deliveryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setDeliveryType(btn.dataset.type);
        });
    });
}

function initializeAddToCartHandler() {
    const productContainer = document.getElementById('product-container');

    if (productContainer) {
        productContainer.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('add-to-cart-btn')) {
    const rollCard = event.target.closest('.roll-card');
    if (rollCard) {
    const productId = parseInt(rollCard.dataset.id, 10);
        addItemToCart(productId, products); 
     }
 }
});
    }
}

function initializeCheckoutButtonHandler() {
    const cartBtn = document.getElementById('cart-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
    if (Object.keys(cartData.items).length > 0) {
        showCheckoutModal(cartData);
        setTimeout(() => clearTheCart(), 500);
    } else {
        showNotification('Your cart is empty!', 'error');
 }
 });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});
