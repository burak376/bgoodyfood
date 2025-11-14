#!/bin/bash

echo "========================================="
echo "  BGoody Food - Backend Başlatılıyor"
echo "========================================="
echo ""

cd backend

echo "1. Paketler kontrol ediliyor..."
dotnet restore

echo ""
echo "2. Backend başlatılıyor..."
echo "   Swagger UI: http://localhost:5000/swagger"
echo "   API Base: http://localhost:5000/api"
echo ""

dotnet watch run
