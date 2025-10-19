// SereNya Cart System - Reusable across all pages
// cart.js

const SereNyaCart = {
    cart: [],
  
    init: function () {
      this.loadCart()
      this.injectCartHTML()
      this.bindEvents()
      this.updateUI()
    },
  
    // Load cart from localStorage
    loadCart: function () {
      try {
        const savedCart = localStorage.getItem("serenya_cart")
        this.cart = savedCart ? JSON.parse(savedCart) : []
      } catch (e) {
        this.cart = []
        console.error("Could not load cart from localStorage")
      }
    },
  
    // Save cart to localStorage
    saveCart: function () {
      try {
        localStorage.setItem("serenya_cart", JSON.stringify(this.cart))
      } catch (e) {
        console.error("Could not save cart to localStorage")
      }
    },
  
    // Inject cart HTML into the page
    injectCartHTML: () => {
      const cartContainer = document.getElementById("cartContainer")
      if (!cartContainer) return
  
      const cartHTML = `
          <div class="cart-overlay" id="cartOverlay">
            <div class="cart-panel">
              <div class="cart-header">
                <div class="cart-header-top">
                  <h2 class="cart-title">Your Cart</h2>
                  <button class="cart-close" id="cartClose">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div class="cart-count" id="cartCount">0 items in cart</div>
              </div>
              
              <div class="cart-content" id="cartContent">
                <div class="cart-empty" id="cartEmpty">
                  <div class="cart-empty-icon">
                    <i class="fas fa-shopping-bag"></i>
                  </div>
                  <div class="cart-empty-title">Your cart is empty</div>
                  <div class="cart-empty-text">Add some beautiful hijabs to get started!</div>
                </div>
              </div>
              
              <div class="cart-footer" id="cartFooter" style="display: none;">
                <div class="cart-total">
                  <span class="cart-total-label">Total</span>
                  <span class="cart-total-amount" id="cartTotalAmount">Rs. 0</span>
                </div>
                <div class="cart-buttons">
                  <button class="continue-shopping-btn" onclick="SereNyaCart.continueShopping()">
                    Continue Shopping
                  </button>
                  <button class="checkout-btn" onclick="SereNyaCart.checkout()">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
  
      cartContainer.innerHTML = cartHTML
    },
  
    // Bind all event listeners
    bindEvents: function () {
      const cartIcon = document.getElementById("cartIcon")
      const cartClose = document.getElementById("cartClose")
      const cartOverlay = document.getElementById("cartOverlay")
  
      if (cartIcon) {
        cartIcon.addEventListener("click", () => this.toggleCart())
      }
  
      if (cartClose) {
        cartClose.addEventListener("click", () => this.closeCart())
      }
  
      if (cartOverlay) {
        cartOverlay.addEventListener("click", (e) => {
          if (e.target === cartOverlay) this.closeCart()
        })
      }
  
      // Escape key to close cart
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeCart()
      })
    },
  
    // Add product to cart (main method to be called from pages)
    addProduct: function (product) {
      const existingIndex = this.cart.findIndex((item) => item.id === product.id)
  
      if (existingIndex > -1) {
        this.cart[existingIndex].quantity += product.quantity || 1
      } else {
        this.cart.push({
          ...product,
          quantity: product.quantity || 1,
        })
      }
  
      this.saveCart()
      this.updateUI()
  
      // Auto-open cart after adding
      setTimeout(() => this.openCart(), 500)
    },
  
    // Increase quantity
    increaseQuantity: function (index) {
      if (this.cart[index]) {
        this.cart[index].quantity += 1
        this.saveCart()
        this.updateUI()
      }
    },
  
    // Decrease quantity
    decreaseQuantity: function (index) {
      if (this.cart[index]) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity -= 1
        } else {
          this.cart.splice(index, 1)
        }
        this.saveCart()
        this.updateUI()
      }
    },
  
    // Remove item from cart
    removeItem: function (index) {
      if (this.cart[index]) {
        this.cart.splice(index, 1)
        this.saveCart()
        this.updateUI()
      }
    },
  
    // Update all UI elements
    updateUI: function () {
      const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0)
      const cartTotal = this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  
      // Update badge
      const cartBadge = document.getElementById("cartBadge")
      if (cartBadge) {
        if (cartCount > 0) {
          cartBadge.textContent = cartCount
          cartBadge.style.display = "flex"
        } else {
          cartBadge.style.display = "none"
        }
      }
  
      // Update cart count and total
      const cartCountElement = document.getElementById("cartCount")
      const cartTotalElement = document.getElementById("cartTotalAmount")
  
      if (cartCountElement) {
        cartCountElement.textContent = `${cartCount} ${cartCount === 1 ? "item" : "items"} in cart`
      }
  
      if (cartTotalElement) {
        cartTotalElement.textContent = `Rs. ${cartTotal.toLocaleString()}`
      }
  
      // Update cart content
      this.renderCartItems()
  
      // Show/hide empty state and footer
      const cartEmpty = document.getElementById("cartEmpty")
      const cartFooter = document.getElementById("cartFooter")
  
      if (cartEmpty && cartFooter) {
        if (this.cart.length === 0) {
          cartEmpty.style.display = "block"
          cartFooter.style.display = "none"
        } else {
          cartEmpty.style.display = "none"
          cartFooter.style.display = "block"
        }
      }
    },
  
    // Render cart items
    renderCartItems: function () {
      const cartContent = document.getElementById("cartContent")
      if (!cartContent) return
  
      // Clear existing items except empty state
      const cartEmpty = document.getElementById("cartEmpty")
      cartContent.innerHTML = ""
      if (cartEmpty) cartContent.appendChild(cartEmpty)
  
      this.cart.forEach((item, index) => {
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"
        cartItem.innerHTML = `
            <div class="cart-item-header">
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-color">Color: ${item.color}</div>
              </div>
              <button class="cart-item-remove" onclick="SereNyaCart.removeItem(${index})" title="Remove item">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="cart-item-details">
              <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="SereNyaCart.decreaseQuantity(${index})" title="Decrease quantity">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="SereNyaCart.increaseQuantity(${index})" title="Increase quantity">+</button>
              </div>
              <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
            </div>
          `
        cartContent.appendChild(cartItem)
      })
    },
  
    // Open cart panel
    openCart: () => {
      const cartOverlay = document.getElementById("cartOverlay")
      if (cartOverlay) {
        cartOverlay.classList.add("active")
        document.body.style.overflow = "hidden"
      }
    },
  
    // Close cart panel
    closeCart: () => {
      const cartOverlay = document.getElementById("cartOverlay")
      if (cartOverlay) {
        cartOverlay.classList.remove("active")
        document.body.style.overflow = "auto"
      }
    },
  
    // Toggle cart panel
    toggleCart: function () {
      const cartOverlay = document.getElementById("cartOverlay")
      if (cartOverlay && cartOverlay.classList.contains("active")) {
        this.closeCart()
      } else {
        this.openCart()
      }
    },
  
    continueShopping: function () {
      this.closeCart()
    },
  
    // Checkout function
    checkout: function () {
      const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0)
      const cartTotal = this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  
      if (cartCount > 0) {
        // Store cart data in sessionStorage for checkout page
        sessionStorage.setItem("checkout_cart", JSON.stringify(this.cart))
        sessionStorage.setItem("checkout_total", cartTotal.toString())
  
        // Redirect to checkout page
        window.location.href = "checkout.html"
      }
    },
  
    // Get cart data (useful for other pages)
    getCart: function () {
      return this.cart
    },
  
    // Get cart count
    getCartCount: function () {
      return this.cart.reduce((total, item) => total + item.quantity, 0)
    },
  
    // Get cart total
    getCartTotal: function () {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0)
    },
  
    // Clear entire cart
    clearCart: function () {
      this.cart = []
      this.saveCart()
      this.updateUI()
    },
  }
  
  // Initialize cart when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    SereNyaCart.init()
  })
  
  // Make it globally available
  window.SereNyaCart = SereNyaCart
  