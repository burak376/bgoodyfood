#!/bin/bash

echo "🔐 Admin Paneli Testi"
echo "======================"

# Test 1: Admin login
echo "1. Admin login testi..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bgoody.com","password":"admin123"}' \
  http://localhost:3000/api/admin/login)

echo "Login response: $LOGIN_RESPONSE"

# Token'ı çıkar
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Login başarılı"
    
    # Test 2: Products API with token
    echo "2. Products API testi (token ile)..."
    curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:3000/api/products | head -c 300
    echo ""
    
    # Test 3: Categories API with token
    echo "3. Categories API testi (token ile)..."
    curl -s -H "Authorization: Bearer $TOKEN" \
      http://localhost:3000/api/categories | head -c 200
    echo ""
    
else
    echo "❌ Login başarısız"
fi

echo ""
echo "🌐 Manuel test linkleri:"
echo "- Admin login: http://localhost:3000/admin/login"
echo "- Admin panel: http://localhost:3000/admin"
echo "- Ana sayfa: http://localhost:3000"
echo ""
echo "📋 Test hesabı:"
echo "- E-posta: admin@bgoody.com"
echo "- Şifre: admin123"