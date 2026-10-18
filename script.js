const products = [
    { id: 1, 
    name: 'iPhone 15', 
    category: 'Mobil', 
    price: 8990, 
    description: 'Smartphone med 48MP kamera och snabb A16-chip.' 
    },
    { id: 2, 
    name: 'AirPods Pro', 
    category: 'Ljud', 
    price: 2890, 
    description: 'Trådlösa hörlurar med aktiv brusreducering.' 
    },
    { id: 3, 
    name: 'MacBook Air 13', 
    category: 'Dator', 
    price: 12990, 
    description: 'Lätt och kraftfull laptop för arbete och skola.' 
    },
    { id: 4, 
    name: '4K Smart TV 55', 
    category: 'TV', 
    price: 6990, 
    description: 'Stort och klart bild med smarta funktioner.' 
    },
    { id: 5, 
    name: 'PlayStation 5', 
    category: 'Spel', 
    price: 6490, 
    description: 'Spelkonsol för nästa generations gaming.' 
    },
    { id: 6, 
    name: 'USB-C Dock', 
    category: 'Tillbehör', 
    price: 1190, 
    description: 'Praktisk dockning för stationär arbetsplats.' 
    },
    { id: 7, 
    name: 'LED-lampa', 
    category: 'lampa', 
    price: 450, 
    description: 'Energisnål lampa för hemmet och kontoret.' 
    }
];

const cart = [];
let selectedCategory = 'Alla';

const productList = document.querySelector('#product-lista');
const cartCount = document.querySelector('#cart-count');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const menuButton = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');
const messageBox = document.querySelector('#message');
const filterButtons = document.querySelectorAll('[data-category]');
const productForm = document.querySelector('#product-form');

function formatPrice(price) {
    return `${Number(price).toLocaleString('sv-SE')} kr`;
}

function showMessage(text, isError = false) {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.classList.add('visible');
    messageBox.classList.toggle('error', isError);
    messageBox.classList.toggle('success', !isError);
}

function updateCart() {
    if (cartCount) {
        cartCount.textContent = String(cart.length);
    }

    if (cartTotal) {
        const total = cart.reduce((sum, product) => sum + product.price, 0);
        cartTotal.textContent = `Totalt: ${formatPrice(total)}`;
    }
}

function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Din kundvagn är tom.</li>';
        updateCart();
        return;
    }

    cartItems.innerHTML = cart.map((product) => `
        <li>
            <span>${product.name} - ${formatPrice(product.price)}</span>
            <button class="remove-from-cart" data-product-id="${product.id}">Ta bort</button>
        </li>
    `).join('');

    cartItems.querySelectorAll('.remove-from-cart').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = Number(event.currentTarget.dataset.productId);
            const index = cart.findIndex((product) => product.id === productId);

            if (index !== -1) {
                cart.splice(index, 1);
                renderCart();
                showMessage('Produkten har tagits bort från kundvagnen.');
            }
        });
    });

    updateCart();
}

function addToCart(product) {
    cart.push(product);
    renderCart();
    showMessage(`${product.name} har lagts till i kundvagnen.`);
}

function renderProducts(category = 'Alla') {
    if (!productList) return;

    selectedCategory = category;

    const filteredProducts = category === 'Alla'
        ? products
        : products.filter((product) => product.category === category);

    if (!filteredProducts.length) {
        productList.innerHTML = '<p>Inga produkter hittades i denna kategori.</p>';
        return;
    }

    productList.innerHTML = filteredProducts.map((product) => `
        <article class="product-card">
            <div class="product-image">${product.category}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="description">${product.description}</p>
                <div class="product-meta">
                    <span class="price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart" data-product-id="${product.id}">Lägg i kundvagn</button>
                </div>
            </div>
        </article>
    `).join('');

    productList.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = Number(event.currentTarget.dataset.productId);
            const selectedProduct = products.find((product) => product.id === productId);

            if (selectedProduct) {
                addToCart(selectedProduct);
            }
        });
    });
}

function setupFilterButtons() {
    if (!filterButtons.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            filterButtons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            renderProducts(category);
        });
    });
}

function setupMobileMenu() {
    if (!menuButton || !menu) return;

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('open');
        menuButton.classList.toggle('active');
    });
}

function setupProductForm() {
    if (!productForm) return;

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(productForm);
        const newCategory = formData.get('category')?.toString().trim() ?? '';
        const newPrice = Number(formData.get('price'));

        if (!newName || !newCategory || !Number.isFinite(newPrice) || newPrice <= 0) {
            showMessage('Fyll i produktnamn, kategori och pris.', true);
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: newName,
            category: newCategory,
            price: newPrice,
            description: 'Ny produkt tillagd av användaren.'
        };

        products.unshift(newProduct);
        productForm.reset();
        renderProducts(selectedCategory);
        showMessage(`${newProduct.name} har lagts till i sortimentet.`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    renderProducts(selectedCategory);
    setupFilterButtons();
    setupMobileMenu();
    setupProductForm();
});