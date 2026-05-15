# 🌍 Production Deployment Checklist

## 🖥️ VPS Setup (Ubuntu 22.04+)
- [ ] Provision $5-10 VPS (DigitalOcean, Hetzner, Linode)
- [ ] Create sudo user, disable root SSH, setup SSH keys
- [ ] Install `ufw`, allow `22/tcp`, `80/tcp`, `443/tcp`
- [ ] Install Node.js 20 LTS + npm
- [ ] Install Caddy: `sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb any main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list && sudo apt update && sudo apt install caddy`

## 📦 Frontend Deployment
- [ ] `npm ci --production && npm run build`
- [ ] Upload `build/` folder to `/var/www/community-app`
- [ ] Create `/etc/caddy/Caddyfile`:
  ```caddy
  yourdomain.com {
    encode gzip
    root * /var/www/community-app
    file_server
    handle /api/* {
      reverse_proxy 127.0.0.1:8090
    }
    handle /* {
      try_files {path} /index.html
      file_server
    }
  }