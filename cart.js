
const Cart = document.querySelector('.cart');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
    if (!cart.length) {
        Cart.innerHTML = '<p class="mt-4">Your cart is empty.</p>';
        return;
    }

    Cart.innerHTML = cart.map(item => {
        const quantity = item.quantity || 1;
        return `
        <div class="card col-12 col-md-6 col-lg-4 mb-3" data-product-id="${item.id}">
            <img src="${item.image}" class="card-img-top p-3" alt="${item.title}" style="height: 200px; object-fit: contain;">
            <div class="card-body">
                <p class="card-title fw-semibold">${item.title}</p>
                <p class="card-text mb-2">$${item.price}</p>
                <div class="d-flex align-items-center gap-2 mb-3">
                    <button class="btn btn-outline-secondary btn-sm" data-action="decrease">-</button>
                    <span class="fw-semibold" data-quantity>${quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm" data-action="increase">+</button>
                </div>
                <button class="btn btn-danger btn-sm" data-action="remove">Remove</button>
            </div>
        </div>
        `;
    }).join('');
}

Cart.addEventListener('click', (e) => {
    const card = e.target.closest('[data-product-id]');
    if (!card) return;
    const id = Number(card.getAttribute('data-product-id'));
    const action = e.target.getAttribute('data-action');

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

renderCart();
