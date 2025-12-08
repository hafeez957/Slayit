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
             <div class="card col-3">
                    <img src="${image}" alt="${title} class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-title">${title}</p>
                        <!--<p class="card-text">${description}</p>-->
                        <a href="#" class="btn btn-primary">Add to Cart</a>
                    </div>
                </div>
            </div>
        `
    }
    productsMain.innerHTML = output;
    categories.forEach(option => {
        option.onclick = (e) => {
            // e.preventdefault();
            let selected_category = e.target.innerText.toLowerCase();
            let filtered_output = "";
            for (const product of api_data) {
                let { category } = product;
                // console.log(category);
                if (selected_category == category) {
                    console.log(product);
                    filtered_output += `
                                <div class="card col-3">
                                        <img src="${product.image}" alt="${product.title} class="card-img-top" alt="...">
                                        <div class="card-body">
                                            <p class="card-title">${product.title}</p>
                                            <a href="#" class="btn btn-primary">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>
        
                             `
                            }
                        }
                        productsMain.innerHTML = filtered_output;
        }
    })
})()

