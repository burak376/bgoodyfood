#!/bin/bash

echo "🛒 Testing Cart Functionality"
echo "================================"

# Test 1: Check if main page loads
echo "1. Testing main page..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
echo " - Main page status"

# Test 2: Check if cart API responds
echo "2. Testing cart API..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/cart
echo " - Cart API status"

# Test 3: Test adding item to cart
echo "3. Testing add to cart..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"productId":"test-1","quantity":1}' \
  http://localhost:3000/api/cart
echo ""

# Test 4: Test cart contents after adding
echo "4. Testing cart contents after adding..."
curl -s http://localhost:3000/api/cart | head -c 200
echo ""

# Test 5: Check if test cart page loads
echo "5. Testing test cart page..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/test-cart
echo " - Test cart page status"

echo "================================"
echo "✅ Cart functionality test completed!"
echo ""
echo "🌐 Visit these URLs to test manually:"
echo "- Main page: http://localhost:3000"
echo "- Test cart page: http://localhost:3000/test-cart"
echo "- Cart API: http://localhost:3000/api/cart"