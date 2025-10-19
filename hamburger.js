// Hamburger Menu Functionality
class HamburgerMenu {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.menu = document.getElementById('mobileMenu');
    this.overlay = document.getElementById('mobileMenuOverlay');
    this.closeBtn = document.querySelector('.hamburger-close-btn');
    
    this.init();
  }
  
  init() {
    // Hamburger icon click
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }
    
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.closeMenu();
      });
    }
    
    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        this.closeMenu();
      });
    }
    
    // Close menu when clicking on links
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    if (this.hamburger) this.hamburger.classList.add('active');
    if (this.menu) this.menu.classList.add('active');
    if (this.overlay) this.overlay.classList.add('active');
    document.body.classList.add('menu-open');
  }
  
  closeMenu() {
    if (this.hamburger) this.hamburger.classList.remove('active');
    if (this.menu) this.menu.classList.remove('active');
    if (this.overlay) this.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
  
  isMenuOpen() {
    return this.menu && this.menu.classList.contains('active');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HamburgerMenu();
});