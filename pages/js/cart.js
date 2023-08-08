const payBtn = document.querySelector('.btn-buy');

payBtn.addEventListener('click', () => {
    fetch('/stripe-checkout', {
        method: 'post',
        headers: new Headers({'Content-type': 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem('cartItems')),
        }),
    })
    .then((res) => res.json())
    .then((url) => {
        location.href = url;
        clearCart();
    })
    .catch((err) => console.log(err));
});

// BUY BUTTON
document.querySelector('.btn-buy').addEventListener('click', () => {
    const cartContent = document.querySelectorAll('.cart-content .cart-box');
    const products = Array.from(cartContent).map((cartBox) => {
        const title = cartBox.querySelector('.product-title').textContent;
        const price = cartBox.querySelector('.price').textContent;
        const productImg = cartBox.querySelector('.product-img').src;
        const quantity = cartBox.querySelector('.quantity').textContent;
        return {
            title,
            price,
            productImg,
            quantity,
        };
    });

    const user = sessionStorage.getItem('username');
    const totalPrice = document.querySelector('.total-price').textContent.replace('$', '');
    const status = 'pending';

    const requestBody = {
        products,
        user,
        totalPrice,
        status,
    };

   fetch('/stripe-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
})
    .then((response) => response.text())
    .then((data) => {
        console.log(data);
        alert('הרכישה הושלמה בהצלחה!');
        window.location.href = '/success'; 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});