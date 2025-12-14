// Only run products page code if the products-main element exists
const productsMain = document.querySelector('.products-main');
const categories = document.querySelectorAll('.product-categories a');
const electronicsProducts = document.querySelector('.electronics-products');

// Cart and addToCart function - available on all pages
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toast notification function
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-success' : type === 'info' ? 'bg-info' : 'bg-warning';
    const icon = type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '⚠';
    
    const toastHTML = `
        <div id="${toastId}" class="toast ${bgColor} text-white" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgColor} text-white border-0">
                <strong class="me-auto">${icon} ${type === 'success' ? 'Success' : type === 'info' ? 'Info' : 'Warning'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

async function addToCart(id) {
    try {
        const api_data = await (await fetch("https://fakestoreapi.com/products")).json();
        for (const product of api_data) {
            if (product.id === id) {
                const existing = cart.find(item => item.id === id);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + 1;
                    showToast(`${existing.title} quantity increased to ${existing.quantity}`, 'success');
                    console.log('Increased quantity for:', existing.title);
                } else {
                    cart.push({ ...product, quantity: 1 });
                    showToast(`${product.title} added to cart!`, 'success');
                    console.log('Product added to cart:', product.title);
                }
                saveCart();
                break;
            }
        }
        console.log(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add product to cart. Please try again.', 'warning');
    }
}

// Only initialize products page if productsMain exists
if (productsMain) {
    productsMain.innerHTML = `<div class="loader"></div>`;

    (async () => {
    let api_data = await (await fetch("https://fakestoreapi.com/products")).json()
    console.log(api_data);
    

    let output = "";

    for (const product of api_data) {
        // console.log(product);
        let { id, title, price, description, category, image, rating } = product;
       
        // console.log(id,title,price,description,category,image,rating);
        output += `
             <div class="card col-3" data-product-id="${id}">
                    <img src="${image}" alt="${title} class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-title">${title}</p>
                         <p class="card-title">$${price}</p>
                        <!--<p class="card-text">${description}</p>-->
                        <a href="#" class="btn btn-primary" onclick="addToCart(${id})">Add to Cart</a>
                    </div>
                </div>
            </div>
        `
    }
    // all products category
    categories[0].addEventListener("click", () => {
        window.navigation.reload();
    })

    productsMain.innerHTML = output;
    
    // Event delegation to handle product card clicks
    productsMain.addEventListener("click", (e) => {
        // Prevent navigation if clicking on "Add to Cart" button
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            return;
        }
        // Find the closest card element with data-product-id
        const card = e.target.closest('[data-product-id]');
        if (card) {
            const productId = card.getAttribute('data-product-id');
            // Navigate to product detail page with product ID
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
    
    categories.forEach(option => {
        option.onclick = (e) => {
            // e.preventDefault();
            let selected_category = e.target.innerText.toLowerCase();
            let filtered_output = "";
            for (const product of api_data) {
                let { category } = product;
                if (selected_category == category) {
                    filtered_output += `
                                <div class="card col-3" data-product-id="${product.id}">
                                        <img src="${product.image}" alt="${product.title} class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${product.title}</p>
                                             <p class="card-title">$${product.price}</p>
                                            <a href="#" class="btn btn-primary" onclick="addToCart(${product.id}); event.stopPropagation();">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>
        
                             `
                }
            }
            productsMain.innerHTML = filtered_output;
        }
       
    })

    // search products

    let search = document.getElementById('search-products');
    search.addEventListener('submit', (e) => {
        e.preventDefault();
        let searchProduct = e.target.search.value;
        let searchFilter = "";
        for (const product of api_data) {
            let { id, title, image, price } = product;
            if (title.toLowerCase().includes(searchProduct.toLowerCase().trim())) {
                searchFilter += `
                                <div class="card col-3" data-product-id="${id}">
                                        <img src="${image}" alt="${title} class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${title}</p>
                                            <p class="card-title">$${price}</p>
                                            <a href="#" class="btn btn-primary" onclick="addToCart(${id}); event.stopPropagation();">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>
                             `
            }
        }
        productsMain.innerHTML = searchFilter || "<h3>No Product found";
    })
    })();
}




