# Capstoned: Smart Contract Vulnerabilities Detection

This project provides a simple front-end (React + Vite) and back-end server to demonstrate smart contract vulnerability detection.

---

## 🚀 Frontend Deployment (React + Vite)

### 1. Build frontend

```bash
npm install
npm run build
```

### 2. Deploy build to Nginx

```bash
sudo rm -rf /usr/share/nginx/html/*
sudo cp -r dist/* /usr/share/nginx/html/
sudo systemctl enable nginx
sudo systemctl restart nginx
```
