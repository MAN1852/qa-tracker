# Self-Hosted VPS Deployment Guide

## Prerequisites
- VPS with Ubuntu 22.04 LTS (DigitalOcean, AWS EC2, Linode, etc.)
- Minimum: 1GB RAM, 1 vCPU
- Domain name (optional but recommended)

---

## Quick Deploy (Automated)

SSH into your VPS and run:
```bash
curl -sSL https://raw.githubusercontent.com/MAN1852/qa-tracker/main/deploy.sh | bash
```

---

## Manual Deployment

### 1. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Clone & Configure
```bash
git clone https://github.com/MAN1852/qa-tracker.git
cd qa-tracker

# Create environment file
cat > .env << EOF
DB_PASSWORD=your_secure_password_here
API_URL=http://your-server-ip:3001/api
EOF
```

### 3. Deploy
```bash
docker-compose up -d --build

# Run migrations
docker-compose exec api npx prisma migrate deploy
```

---

## Add SSL (HTTPS)

### Using Caddy (Easiest)
```bash
# Install Caddy
sudo apt install -y caddy

# Configure
sudo tee /etc/caddy/Caddyfile << EOF
yourdomain.com {
    reverse_proxy localhost:80
}
api.yourdomain.com {
    reverse_proxy localhost:3001
}
EOF

sudo systemctl reload caddy
```

---

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all
docker-compose down

# Update
git pull && docker-compose up -d --build
```

---

## Firewall Setup
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```
