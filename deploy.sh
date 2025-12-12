#!/bin/bash

# QA Tracker VPS Deployment Script
# Run this on your VPS (Ubuntu/Debian)

set -e

echo "🚀 QA Tracker VPS Deployment"
echo "============================"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Clone repository
echo "📂 Cloning repository..."
if [ ! -d "qa-tracker" ]; then
    git clone https://github.com/MAN1852/qa-tracker.git
fi
cd qa-tracker

# Create environment file
echo "⚙️ Creating environment file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
API_URL=http://$(curl -s ifconfig.me):3001/api
EOF
    echo "📝 Created .env file with secure password"
fi

# Build and start containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Run database migrations
echo "🗄️ Running database migrations..."
sleep 10  # Wait for database to be ready
docker-compose exec -T api npx prisma migrate deploy

echo ""
echo "✅ Deployment complete!"
echo "========================"
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "Backend:  http://$(curl -s ifconfig.me):3001"
echo ""
echo "⚠️ For production, set up:"
echo "   - Domain name"
echo "   - SSL certificate (Let's Encrypt)"
echo "   - Firewall (UFW)"
