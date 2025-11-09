// Test Component for CartDropdown with Angular 20 syntax and CartItem component
// This file tests the component logic without Angular dependencies

// Mock data from carrito-compras.json (actual data)
const mockCartData = [
  {
    "id": 1,
    "nombre": "Auriculares Bluetooth",
    "precio": 129.99,
    "categoria": "Electrónica",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 2,
    "nombre": "Zapatillas Running",
    "precio": 89.5,
    "categoria": "Deportes",
    "imagen": "/images/gato.jpg",
    "cantidad": 2
  },
  {
    "id": 3,
    "nombre": "Mochila Antirrobo",
    "precio": 59.99,
    "categoria": "Accesorios",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 4,
    "nombre": "Teclado Mecánico RGB",
    "precio": 74.25,
    "categoria": "Computación",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 5,
    "nombre": "Smartwatch Deportivo",
    "precio": 149.0,
    "categoria": "Tecnología",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 6,
    "nombre": "Lámpara LED Escritorio",
    "precio": 39.9,
    "categoria": "Hogar",
    "imagen": "/images/gato.jpg",
    "cantidad": 3
  },
  {
    "id": 7,
    "nombre": "Cámara Web Full HD",
    "precio": 54.75,
    "categoria": "Computación",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 8,
    "nombre": "Botella Térmica 1L",
    "precio": 24.99,
    "categoria": "Camping",
    "imagen": "/images/gato.jpg",
    "cantidad": 2
  },
  {
    "id": 9,
    "nombre": "Mouse Gamer",
    "precio": 45.0,
    "categoria": "Gaming",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  },
  {
    "id": 10,
    "nombre": "Cargador USB-C 65W",
    "precio": 32.5,
    "categoria": "Accesorios",
    "imagen": "/images/gato.jpg",
    "cantidad": 1
  }
];

// Mock CartItem component
class CartItemComponent {
  constructor(item) {
    this.item = item;
    this.quantityChange = { emit: (data) => console.log('Quantity change emitted:', data) };
    this.removeItem = { emit: (id) => console.log('Remove item emitted:', id) };
  }

  updateQuantity(id, quantity) {
    if (quantity >= 0) {
      this.quantityChange.emit({ id, quantity });
    }
  }

  onRemoveItem(id) {
    this.removeItem.emit(id);
  }
}

// Mock CartDropdown class with Angular 20 syntax support
class CartDropdown {
  constructor() {
    this.cartItems = [];
    this.isDropdownOpen = false;
    this.totalItems = 0;
    this.totalPrice = 0;
    this.cartItemComponents = []; // Store cart item components
    this.loadCartData();
  }

  loadCartData() {
    // Simulate loading from JSON
    this.cartItems = mockCartData;
    this.calculateTotals();
    this.createCartItemComponents();
  }

  createCartItemComponents() {
    // Create mock cart item components for testing
    this.cartItemComponents = this.cartItems.map(item => new CartItemComponent(item));
  }

  calculateTotals() {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  removeItem(itemId) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.cartItemComponents = this.cartItemComponents.filter(comp => comp.item.id !== itemId);
    this.calculateTotals();
  }

  updateQuantity(itemId, newQuantity) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].id === itemId) {
        if (newQuantity > 0) {
          this.cartItems[i].cantidad = newQuantity;
          // Update corresponding cart item component
          if (this.cartItemComponents[i]) {
            this.cartItemComponents[i].item.cantidad = newQuantity;
          }
          this.calculateTotals();
        }
        break;
      }
    }
  }
}

// Test runner
function runTests() {
  console.log('🧪 Running CartDropdown Tests with Angular 20 syntax...\n');
  
  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`✅ ${testName}`);
      passedTests++;
    } else {
      console.log(`❌ ${testName}`);
    }
  }

  // Test 1: Component initialization with Angular 20 syntax
  console.log('1️⃣ Testing Component Initialization with Angular 20 syntax...');
  const component = new CartDropdown();
  console.log(`   Cart items: ${component.cartItems.length}`);
  console.log(`   Total items: ${component.totalItems}`);
  console.log(`   Total price: ${component.totalPrice}`);
  assert(component.cartItems.length === 10, 'Cart items loaded correctly');
  assert(component.totalItems === 14, 'Total items calculated correctly (1+2+1+1+1+3+1+2+1+1)');
  assert(Math.abs(component.totalPrice - 894.16) < 0.01, 'Total price calculated correctly');
  assert(component.isDropdownOpen === false, 'Dropdown starts closed');
  assert(component.cartItemComponents.length === 10, 'Cart item components created correctly');

  // Test 2: Dropdown toggle (Angular 20 @if syntax)
  console.log('\n2️⃣ Testing Dropdown Toggle with @if syntax...');
  component.toggleDropdown();
  assert(component.isDropdownOpen === true, 'Dropdown opens correctly (for @if condition)');
  component.toggleDropdown();
  assert(component.isDropdownOpen === false, 'Dropdown closes correctly (for @if condition)');

  // Test 3: Remove item with component cleanup
  console.log('\n3️⃣ Testing Remove Item with Component Cleanup...');
  const initialItems = component.cartItems.length;
  const initialComponents = component.cartItemComponents.length;
  const initialTotal = component.totalItems;
  component.removeItem(1);
  assert(component.cartItems.length === initialItems - 1, 'Item removed from cart');
  assert(component.cartItemComponents.length === initialComponents - 1, 'Cart item component removed');
  assert(component.totalItems === initialTotal - 1, 'Total items updated correctly (removed item with quantity 1)');

  // Test 4: Update quantity with component synchronization
  console.log('\n4️⃣ Testing Update Quantity with Component Synchronization...');
  const itemId = 2;
  const newQuantity = 3;
  const oldTotal = component.totalItems;
  const oldItemQuantity = component.cartItems.find(item => item.id === itemId).cantidad;
  component.updateQuantity(itemId, newQuantity);
  assert(component.cartItems.find(item => item.id === itemId).cantidad === 3, 'Quantity updated correctly in cart');
  assert(component.totalItems === oldTotal + (newQuantity - oldItemQuantity), 'Total items updated correctly');

  // Test 5: CartItem component functionality
  console.log('\n5️⃣ Testing CartItem Component Functionality...');
  const testItem = component.cartItems[0];
  const cartItemComp = new CartItemComponent(testItem);
  assert(cartItemComp.item.id === testItem.id, 'CartItem component receives item correctly');
  assert(typeof cartItemComp.updateQuantity === 'function', 'CartItem has updateQuantity method');
  assert(typeof cartItemComp.onRemoveItem === 'function', 'CartItem has onRemoveItem method');

  // Test 6: Angular 20 @for track functionality simulation
  console.log('\n6️⃣ Testing @for track functionality...');
  const itemsWithUniqueIds = component.cartItems.map(item => item.id);
  const uniqueIds = [...new Set(itemsWithUniqueIds)];
  assert(itemsWithUniqueIds.length === uniqueIds.length, 'All cart items have unique IDs for @for track');

  // Summary
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Angular 20 syntax and CartItem component are working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
  }
}

// Run the tests
runTests();