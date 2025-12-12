// Get product ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Get DOM elements
const productLoader = document.getElementById('product-loader');
const productDetail = document.getElementById('product-detail');
const productError = document.getElementById('product-error');
const productImage = document.getElementById('product-image');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productCategory = document.getElementById('product-category');
const productRating = document.getElementById('product-rating');
const productRatingCount = document.getElementById('product-rating-count');
const addToCartBtn = document.getElementById('add-to-cart-btn');

// Cart array (shared with main script)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to display stars for rating
function displayRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }
    if (hasHalfStar) {
        starsHTML += '½';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }
    return starsHTML;
}

// Fetch and display product details
async function loadProductDetails() {
    if (!productId) {
        productLoader.style.display = 'none';
        productError.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();
        
        // Display product details
        productImage.src = product.image;
        productImage.alt = product.title;
        productTitle.textContent = product.title;
        productPrice.textContent = product.price;
        productDescription.textContent = product.description;
        productCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        productRating.textContent = displayRating(product.rating.rate);
        productRatingCount.textContent = `(${product.rating.count} reviews)`;

        // Add to cart functionality
        addToCartBtn.onclick = () => {
            const existing = cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
                addToCartBtn.textContent = 'Quantity Increased';
                addToCartBtn.classList.remove('btn-primary');
                addToCartBtn.classList.add('btn-success');
            } else {
                cart.push({ ...product, quantity: 1 });
                addToCartBtn.textContent = 'Added to Cart!';
                addToCartBtn.classList.remove('btn-primary');
                addToCartBtn.classList.add('btn-success');
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            setTimeout(() => {
                addToCartBtn.textContent = 'Add to Cart';
                addToCartBtn.classList.remove('btn-success');
                addToCartBtn.classList.remove('btn-warning');
                addToCartBtn.classList.add('btn-primary');
            }, 2000);
        };

        // Hide loader and show product details
        productLoader.style.display = 'none';
        productDetail.style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading product:', error);
        productLoader.style.display = 'none';
        productError.style.display = 'block';
    }
}

// Load product details when page loads
loadProductDetails();

