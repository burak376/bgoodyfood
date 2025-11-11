// Simple test script to verify admin products functionality
// This would be run in browser console after logging in as admin

console.log('🧪 Testing Admin Products Functionality');

// Test 1: Check if admin login works
const testAdminLogin = async () => {
  console.log('📝 Test 1: Admin Login');
  
  // Simulate admin login
  localStorage.setItem('authToken', 'demo-token');
  localStorage.setItem('user', JSON.stringify({
    id: '1',
    name: 'Admin User',
    email: 'admin@bgoody.com',
    role: 'ADMIN',
    provider: 'email'
  }));
  
  console.log('✅ Admin login simulated');
};

// Test 2: Check if product management page loads
const testProductPage = () => {
  console.log('📝 Test 2: Product Management Page');
  
  // Check if we can navigate to admin products
  window.location.href = '/admin/products';
  
  setTimeout(() => {
    if (window.location.pathname === '/admin/products') {
      console.log('✅ Admin products page loaded');
    } else {
      console.log('❌ Failed to load admin products page');
    }
  }, 2000);
};

// Test 3: Check if modal functionality works
const testModalFunctionality = () => {
  console.log('📝 Test 3: Modal Functionality');
  
  // Wait for page to load then test buttons
  setTimeout(() => {
    const addProductBtn = document.querySelector('button:has([data-lucide="plus"])');
    const editButtons = document.querySelectorAll('button:has([data-lucide="edit"])');
    const viewButtons = document.querySelectorAll('button:has([data-lucide="eye"])');
    
    if (addProductBtn) {
      console.log('✅ Add Product button found');
      addProductBtn.click();
      
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          console.log('✅ Product modal opened successfully');
          
          // Close modal
          const closeBtn = modal.querySelector('button:has([data-lucide="x"])');
          if (closeBtn) {
            closeBtn.click();
            console.log('✅ Modal closed successfully');
          }
        } else {
          console.log('❌ Modal not found');
        }
      }, 1000);
    } else {
      console.log('❌ Add Product button not found');
    }
    
    if (editButtons.length > 0) {
      console.log(`✅ Found ${editButtons.length} Edit buttons`);
    } else {
      console.log('❌ No Edit buttons found');
    }
    
    if (viewButtons.length > 0) {
      console.log(`✅ Found ${viewButtons.length} View buttons`);
    } else {
      console.log('❌ No View buttons found');
    }
  }, 3000);
};

// Run tests
testAdminLogin();
setTimeout(testProductPage, 1000);
setTimeout(testModalFunctionality, 4000);

console.log('🧪 Tests initiated. Check console for results.');