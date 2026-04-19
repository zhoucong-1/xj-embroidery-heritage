let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElements = document.querySelectorAll('#cart-count');
  countElements.forEach(el => el.textContent = count);
}

function addToCart(productId, quantity = 1) {
  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        });
      }
      
      saveCart();
      updateCartCount();
      showNotification(`${product.name} 已加入购物车`);
    })
    .catch(error => {
      console.error('添加购物车失败:', error);
      showNotification('添加购物车失败', 'error');
    });
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCart();
    }
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty">
        <p>购物车是空的</p>
        <a href="shop.html" class="btn-primary">去购物</a>
      </div>
    `;
    document.getElementById('cart-total').textContent = '¥0';
    return;
  }
  
  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="cart-item-price">¥${item.price}</p>
      </div>
      <div class="cart-item-actions">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <p class="cart-item-subtotal">¥${(item.price * item.quantity).toFixed(2)}</p>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
    </div>
  `).join('');
  
  document.getElementById('cart-total').textContent = `¥${getCartTotal().toFixed(2)}`;
}

async function submitOrder(event) {
  event.preventDefault();
  
  const form = event.target;
  const customerName = form.customerName.value;
  const customerPhone = form.customerPhone.value;
  const customerAddress = form.customerAddress.value;
  
  if (!customerName || !customerPhone || cart.length === 0) {
    showNotification('请填写完整的订单信息', 'error');
    return;
  }
  
  const orderData = {
    customerName,
    customerPhone,
    customerAddress,
    items: cart,
    totalAmount: getCartTotal()
  };
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (response.ok) {
      clearCart();
      showNotification('订单提交成功！我们会尽快与您联系');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      throw new Error('订单提交失败');
    }
  } catch (error) {
    console.error('订单提交失败:', error);
    showNotification('订单提交失败，请稍后重试', 'error');
  }
}

if (typeof window !== 'undefined') {
  updateCartCount();
}