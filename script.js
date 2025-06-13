// High-quality product data with Unsplash images
const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    desc: "Crisp sound, deep bass, all-day comfort. Bluetooth 5.0.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1516707892062-40d33c1357b4?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    title: "Smart Watch",
    desc: "Track fitness, receive notifications, stylish & durable.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    desc: "Powerful sound, compact design, waterproof.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    title: "Gaming Mouse",
    desc: "High precision, RGB lighting, ergonomic grip.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    title: "Fitness Tracker",
    desc: "Monitor heart rate, sleep & steps. Long battery life.",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
  }
];

let cart = {};

// Render products
function renderProducts() {
  const productsDiv = document.getElementById('products-list');
  productsDiv.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="product-title">${p.title}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
    `;
    productsDiv.appendChild(card);
  });
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = +e.target.getAttribute('data-id');
      addToCart(id);
      showCartSidebar();
    });
  });
}

// Render cart sidebar
function renderCart() {
  const cartItemsUl = document.getElementById('cart-items');
  const cartTotalDiv = document.getElementById('cart-total');
  cartItemsUl.innerHTML = '';
  let total = 0;
  let itemCount = 0;
  Object.values(cart).forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img class="cart-item-img" src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-action="dec" aria-label="Decrease quantity">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="remove-item" data-id="${item.id}" aria-label="Remove item">&times;</button>
    `;
    cartItemsUl.appendChild(li);
    total += item.price * item.qty;
    itemCount += item.qty;
  });
  cartTotalDiv.textContent = itemCount
    ? `Total: $${total.toFixed(2)}`
    : "Your cart is empty.";
  document.getElementById('cart-count').textContent = itemCount;
  document.getElementById('checkout-btn').disabled = itemCount === 0;

  // Event listeners
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (action === 'inc') addToCart(id);
      else if (action === 'dec') removeFromCart(id, true);
    };
  });
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.getAttribute('data-id');
      removeFromCart(id, false, true);
    };
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!cart[id]) cart[id] = { ...product, qty: 1 };
  else cart[id].qty += 1;
  renderCart();
}

function removeFromCart(id, decQty = false, removeAll = false) {
  if (cart[id]) {
    if (removeAll) delete cart[id];
    else if (decQty) {
      cart[id].qty -= 1;
      if (cart[id].qty <= 0) delete cart[id];
    }
    renderCart();
  }
}

function showCartSidebar() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-sidebar').focus();
}
function hideCartSidebar() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

// Cart button toggles
document.getElementById('cart-btn').onclick = showCartSidebar;
document.getElementById('close-cart').onclick = hideCartSidebar;
document.getElementById('cart-overlay').onclick = hideCartSidebar;

// Checkout modal
function showCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('open');
}
function hideCheckoutModal() {
  document.getElementById('checkout-modal').classList.remove('open');
}
document.getElementById('close-modal').onclick = hideCheckoutModal;

document.getElementById('checkout-btn').onclick = () => {
  cart = {};
  renderCart();
  hideCartSidebar();
  setTimeout(showCheckoutModal, 380);
};

renderProducts();
renderCart();