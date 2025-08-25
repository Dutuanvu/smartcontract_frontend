# Capstoned: Smart Contract Vulnerabilities Detection

This project provides a simple front-end (React + Vite) and back-end server to demonstrate smart contract vulnerability detection.

---

## 🚀 Frontend Deployment (React + Vite)

### 1. Install Node.js and Nginx

Amazon Linux:

```bash
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs nginx unzip
```

Ubuntu/Debian:

```bash
sudo apt update -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx unzip
```

### 2. Build frontend

```bash
npm install
npm run build
```

### 3. Deploy build to Nginx

```bash
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html/
sudo systemctl enable nginx
sudo systemctl restart nginx
```
