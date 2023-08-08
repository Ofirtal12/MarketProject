// CART OPEN CLOSE
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// OPEN CART
cartIcon.onclick = () => {
    cart.classList.add('active');
};
// CLOSE CART
closeCart.onclick = () => {
    cart.classList.remove('active');
};

// ADD TO CART 
// cart working js
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// MAKING FUNCTION 
function ready() {
    // REMOVING ITEM FROM CART
    let removeCartButtons = document.getElementsByClassName('cart-remove');
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // QUANTITY CHANGE
    let quantityInputs = document.getElementsByClassName('cart-quantity');
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // ADD TO CART
    let addCart = document.getElementsByClassName('add-cart');
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
}

// REMOVE CART ITEM
function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
}


// QUANTITY CHANGE FUNC
function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

// ADD CART FUNCTION
function addCartClicked(event) {
    let button = event.target;
    let shopProducts = button.parentElement;
    let title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    let price = shopProducts.getElementsByClassName('price')[0].innerText;
    let productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title, price, productImg) {
    let cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    let cartItems = document.getElementsByClassName('cart-content')[0];
    let cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert('You have already added this item to cart');
            return;
        }
    }
    let cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input 
        type="number"
         name=""
         id=""
         value="1"
         class="cart-quantity"
         />
    </div>
    <!-- Remove Item -->
    <i class='bx bx-trash-alt bx-tada cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon();
}

// UPDATE TOTAL
function updateTotal() {
    let cartContent = document.getElementsByClassName('cart-content')[0];
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName('cart-price')[0];
        let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        let price = parseFloat(priceElement.innerText.replace('$', ''));
        let quantity = quantityElement.value;
        total += price * quantity;

        document.getElementsByClassName('total-price')[0].innerText = '$' + total;
    }
    // if price contain some cents
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = '$' + total;
    // SAVE TOTAL TO LOCALSTORAGE
    localStorage.setItem('cartTotal', total);
}

// LOCAL STORAGE= KEEP ITEMS IN CART WHEN REFRASHING THE PAGE 
function saveCartItems() {
    let cartContent = document.getElementsByClassName('cart-content')[0];
    let cartBoxes = cartContent.getElementsByClassName('cart-box');
    let cartItems = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        let priceElement = cartBox.getElementsByClassName('cart-price')[0];
        let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        let productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        let item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// LOADS IN CART
function loadCartItems() {
    let cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            let cartBoxes = document.getElementsByClassName('cart-box');
            let cartBox = cartBoxes[cartBoxes.length - 1];
            let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    let cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
    }
    updateCartIcon();
}

// QUANTITY IN CART ICON
function updateCartIcon() {
    let cartBoxes = document.getElementsByClassName('cart-box');
    let quantity = 0;

    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    let cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute("data-quantity", quantity);
}



// CREATE CART ITEMS AFTER SUCCESSFUL PAYMENT
function clearCart() {
    let cartContent = document.getElementsByClassName('cart-content')[0];
    cartContent.innerHTML = '';
    updateTotal();
    localStorage.removeItem('cartItems');
}



 // קבועים
 const products = [
    { name: "Product 1", price: 10 },
    { name: "Product 2", price: 20 },
    { name: "Product 3", price: 15 },
    { name: "Product 4", price: 25 }
];

// פונקציה להצגת המוצרים
function displayProducts(products) {
    // קוד הצגת המוצרים כאן
}

// פונקציה למיון המוצרים לפי שם
function sortByName() {
    products.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts(products);
}

// פונקציה למיון המוצרים לפי מחיר
function sortByPrice() {
    products.sort((a, b) => a.price - b.price);
    displayProducts(products);
}

// טעינת הדף
window.onload = function() {
    displayProducts(products);
    
    const sortSelect = document.getElementById("sort-select");
    const sortButton = document.getElementById("sort-button");
    
    // הוספת אירוע לחיצה על הכפתור "מיון"
    sortButton.addEventListener("click", function() {
        const selectedOption = sortSelect.value;
        
        if (selectedOption === "name") {
            sortByName();
        } else if (selectedOption === "price") {
            sortByPrice();
        }
    });
}
// SORT PRODUCTS
function sortProducts() {
    let select = document.getElementById('sort-select');
    let selectedValue = select.value;

    let shopContent = document.querySelector('.shop-content');
    let products = Array.from(shopContent.getElementsByClassName('product-box'));

    if (selectedValue === 'name') {
        products.sort((a, b) => {
            let titleA = a.querySelector('.product-title').innerText.toLowerCase();
            let titleB = b.querySelector('.product-title').innerText.toLowerCase();
            return titleA.localeCompare(titleB);
        });
    } else if (selectedValue === 'price') {
        products.sort((a, b) => {
            let priceA = parseFloat(a.querySelector('.price').innerText.slice(1));
            let priceB = parseFloat(b.querySelector('.price').innerText.slice(1));
            return priceA - priceB;
        });
    }

    shopContent.innerHTML = '';
    products.forEach((product) => {
        shopContent.appendChild(product);
    });
}

// ADD EVENT LISTENER TO SORT BUTTON
let sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', sortProducts);
