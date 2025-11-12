const rollCards = document.getElementById('product-container'); 
products.forEach(
    ({id, name, price, image, description}) => {
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
    }
);