const productsMain = document.querySelector('.products-main');
const categories = document.querySelectorAll('.product-categories a');
const electronicsProducts = document.querySelector('.electronics-products');

console.log(electronicsProducts);

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
                // console.log(category);
                if (selected_category == category) {
                    console.log(product);
                    filtered_output += `
                                <div class="card col-3" data-product-id="${product.id}">
                                        <img src="${product.image}" alt="${product.title} class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${product.title}</p>
                                             <p class="card-title">$${product.price}</p>
                                            <a href="#" class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</a>
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
            let { title, image, price } = product;
            if (title.toLowerCase().includes(searchProduct.toLowerCase().trim())) {
                searchFilter += `
                                <div class="card col-3" data-product-id="${id}">
                                        <img src="${image}" alt="${title} class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${title}</p>
                                            <p class="card-title">$${price}</p>
                                            <a href="#" class="btn btn-primary" onclick="addToCart(${id})">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>
                             `
            }
        }
        productsMain.innerHTML = searchFilter || "<h3>No Product found";
    })
})()

// Load cart from localStorage or initialize empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

async function addToCart(id) {
    let api_data = await (await fetch("https://fakestoreapi.com/products")).json()
    for (const product of api_data) {
        if (product.id == id) {
            // Check if product with this id already exists in cart
            if(!cart.some(item => item.id === id)){
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Product added to cart:', product.title);
            } else {
                console.log('Product already in cart');
            }
        }
    }
    console.log(cart);    
}




