const Cart = document.querySelector('.cart');
const totalItemsEl = document.getElementById('total-items');
const subtotalEl = document.getElementById('subtotal');
const totalAmountEl = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateTotals() {
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        const quantity = item.quantity || 1;
        totalItems += quantity;
        subtotal += item.price * quantity;
    });

    return { totalItems, subtotal };
}

function updateSummary() {
    const { totalItems, subtotal } = calculateTotals();
    
    totalItemsEl.textContent = totalItems;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalAmountEl.textContent = `$${subtotal.toFixed(2)}`;
    
    // Enable/disable checkout button
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Cart is Empty';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
    }
}

function renderCart() {
    if (!cart.length) {
        Cart.innerHTML = `
            <div class="col-12 text-center py-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cart-x text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                <h3 class="text-muted">Your cart is empty</h3>
                <p class="text-muted">Add some products to get started!</p>
                <a href="./products.html" class="btn btn-primary mt-3">Browse Products</a>
            </div>
        `;
        updateSummary();
        return;
    }

    Cart.innerHTML = cart.map(item => {
        const quantity = item.quantity || 1;
        const itemSubtotal = (item.price * quantity).toFixed(2);
        return `
        <div class="col-12 mb-4">
            <div class="card cart-item-card h-100 shadow-sm" data-product-id="${item.id}">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="img-fluid rounded-start p-3" alt="${item.title}" style="height: 200px; object-fit: contain; width: 100%;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title mb-2">${item.title}</h5>
                            <p class="card-text text-muted mb-2">Price: $${item.price}</p>
                            <div class="mb-3">
                                <label class="form-label mb-1">Quantity:</label>
                                <div class="quantity-controls">
                                    <button class="btn btn-outline-secondary btn-sm" data-action="decrease" style="border: none; background: white; padding: 5px 12px;">
                                        <strong>-</strong>
                                    </button>
                                    <span class="fw-bold" data-quantity style="min-width: 30px; text-align: center;">${quantity}</span>
                                    <button class="btn btn-outline-secondary btn-sm" data-action="increase" style="border: none; background: white; padding: 5px 12px;">
                                        <strong>+</strong>
                                    </button>
                                </div>
                            </div>
                            <div class="subtotal mb-3">
                                Subtotal: $${itemSubtotal}
                            </div>
                            <button class="btn btn-danger btn-sm mt-auto" data-action="remove" style="width: fit-content;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    updateSummary();
}

Cart.addEventListener('click', (e) => {
    const card = e.target.closest('[data-product-id]');
    if (!card) return;
    const id = Number(card.getAttribute('data-product-id'));
    const action = e.target.getAttribute('data-action') || e.target.closest('[data-action]')?.getAttribute('data-action');

    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (action === 'increase') {
        item.quantity = (item.quantity || 1) + 1;
    } else if (action === 'decrease') {
        item.quantity = Math.max(1, (item.quantity || 1) - 1);
    } else if (action === 'remove') {
        cart = cart.filter(p => p.id !== id);
    } else {
        return;
    }

    saveCart();
    renderCart();
});

// Initialize
renderCart();
