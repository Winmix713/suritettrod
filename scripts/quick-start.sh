#!/bin/bash

echo "🚀 FIGMA TO REACT CONVERTER - GYORS INDÍTÁS"
echo "============================================="

# Színek definiálása
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Függvény a lépések jelzésére
print_step() {
    echo -e "${BLUE}[LÉPÉS $1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Ellenőrizzük, hogy Node.js telepítve van-e
print_step "1" "Node.js verzió ellenőrzése..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js telepítve: $NODE_VERSION"
else
    print_error "Node.js nincs telepítve! Telepítse a https://nodejs.org oldalról"
    exit 1
fi

# 2. Ellenőrizzük, hogy npm telepítve van-e
print_step "2" "npm verzió ellenőrzése..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm telepítve: $NPM_VERSION"
else
    print_error "npm nincs telepítve!"
    exit 1
fi

# 3. Függőségek telepítése
print_step "3" "Függőségek telepítése..."
if npm install; then
    print_success "Függőségek sikeresen telepítve"
else
    print_error "Hiba a függőségek telepítése során"
    exit 1
fi

# 4. .env.local fájl ellenőrzése
print_step "4" ".env.local fájl ellenőrzése..."
if [ -f ".env.local" ]; then
    print_success ".env.local fájl megtalálva"
else
    print_warning ".env.local fájl nem található"
    echo "Másolja az .env.example fájlt .env.local néven:"
    echo "cp .env.example .env.local"
    echo "Majd töltse ki a szükséges API kulcsokat!"
fi

# 5. Környezeti változók validálása
print_step "5" "Környezeti változók validálása..."
if node scripts/validate-environment.js; then
    print_success "Környezeti változók rendben"
else
    print_warning "Környezeti változók hiányosak - ellenőrizze a .env.local fájlt"
fi

# 6. TypeScript ellenőrzése
print_step "6" "TypeScript típusok ellenőrzése..."
if npm run type-check; then
    print_success "TypeScript típusok rendben"
else
    print_warning "TypeScript típus hibák találhatók"
fi

# 7. Fejlesztői szerver indítása
print_step "7" "Fejlesztői szerver indítása..."
echo ""
echo "🎉 MINDEN KÉSZ!"
echo "==============="
echo ""
echo "A szerver indításához futtassa:"
echo -e "${GREEN}npm run dev${NC}"
echo ""
echo "Majd nyissa meg a böngészőben:"
echo -e "${BLUE}http://localhost:3000${NC}"
echo ""
echo "📋 KÖVETKEZŐ LÉPÉSEK:"
echo "1. Szerezzen be Figma Access Token-t"
echo "2. Szerezzen be Groq API kulcsot"
echo "3. Töltse ki a .env.local fájlt"
echo "4. Indítsa el a szervert: npm run dev"
echo ""
echo "🔗 HASZNOS LINKEK:"
echo "• Figma Token: https://figma.com/developers/api#access-tokens"
echo "• Groq API: https://console.groq.com/"
echo "• Dokumentáció: README.md"
echo ""

# Opcionálisan automatikusan indítsa a szervert
read -p "Szeretné most elindítani a fejlesztői szervert? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "8" "Szerver indítása..."
    npm run dev
fi
