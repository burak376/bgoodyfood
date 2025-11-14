#!/bin/bash

echo "========================================="
echo "  Backoffice Backend Başlatılıyor"
echo "========================================="
echo ""

cd backend

echo "1. Paketler kontrol ediliyor..."
dotnet restore

echo ""
echo "2. Backend başlatılıyor..."
echo "   Swagger UI: http://localhost:5001/swagger"
echo "   API Base: http://localhost:5001/api"
echo ""

dotnet watch run --urls="http://localhost:5001"
