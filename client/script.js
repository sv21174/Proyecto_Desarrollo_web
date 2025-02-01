document.getElementById('start-voice').addEventListener('click', startVoiceControl);

let products = [];
let cart = [];

function startVoiceControl() {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.start();

        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log(`Comando recibido: ${command}`);
            processVoiceCommand(command);
        }

        recognition.onerror = function(event) {
            console.error("Error en el reconocimiento de voz: ", event.error);
        }
    } else {
        alert("Tu navegador no soporta control por voz.");
    }
}

function processVoiceCommand(command) {
    if (command.includes('mostrar productos')) {
        loadProducts();
    } else if (command.includes('añadir al carrito')) {
        addToCart(command);
    } else if (command.includes('finalizar compra')) {
        checkout();
    }
}

function loadProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts();
        })
        .catch(error => console.error("Error al cargar productos: ", error));
}

function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product._id}')">Añadir al carrito</button>
        `;
        container.appendChild(productElement);
    });
}

function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `${item.name} - $${item.price}`;
        cartItems.appendChild(cartItem);
    });
}

function checkout() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart })
    })
    .then(response => response.json())
    .then(data => alert("Compra realizada con éxito!"))
    .catch(error => console.error("Error en la compra: ", error));
}
