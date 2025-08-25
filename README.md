# Capstoned: Smart Contract Vulnerabilities Detection
---

## 🚀 Frontend Deployment (React + Vite)

### 1. Install NodeJs
```bash
sudo amazon-linux-extras enable nodejs20
sudo yum install -y nodejs npm
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
