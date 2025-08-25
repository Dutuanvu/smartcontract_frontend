# Capstoned: Smart Contract Vulnerabilities Detection
---

## 🚀 Frontend Deployment (React + Vite)

### 1. Build frontend

```bash
npm install
npm run build
```

### 2. Install Nginx

```bash
sudo yum install -y nginx
```

### 3. Deploy build using Nginx
```bash
sudo systemctl enable nginx
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html/
sudo systemctl restart nginx
```
