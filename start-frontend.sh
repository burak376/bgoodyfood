#!/bin/bash

echo "========================================="
echo "  BGoody Food - Frontend Başlatılıyor"
echo "========================================="
echo ""

cd frontend

echo "1. Node modules kontrol ediliyor..."
if [ ! -d "node_modules" ]; then
    echo "   npm install çalıştırılıyor..."
    npm install
fi

echo ""
echo "2. Frontend başlatılıyor..."
echo "   URL: http://localhost:5173"
echo ""

npm run dev
