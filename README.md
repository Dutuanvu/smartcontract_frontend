# Capstoned: Smart Contract Vulnerabilities Detection
---

## 🚀 Frontend Deployment (React + Vite)

### 1. Install NodeJs
```bash
sudo dnf module enable nodejs:20 -y
sudo dnf install -y nodejs npm
```

### 2. Build front-end using NodeJs

```bash
npm install
npm run build
```

### 3. Install Nginx

```bash
sudo yum install -y nginx
```

### 4. Deploy build using Nginx
```bash
sudo systemctl enable nginx
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html/
sudo systemctl restart nginx
```
