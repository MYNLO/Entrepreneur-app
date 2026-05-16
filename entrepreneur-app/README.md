# Entrepreneur Community App

## 🚀 Local Setup
1. `npm install`
2. Download PocketBase (macOS arm64), place `pocketbase` binary in root
3. Run `./pocketbase serve` (Terminal 1)
4. Run `npm run dev` (Terminal 2)
5. Open `http://localhost:5173`

## 🗄️ PocketBase Setup
1. Open `http://127.0.0.1:8090/_/` → Create admin account
2. Import collections from `pb_schema_export.json` (generate via Admin UI)
3. Set API Rules per Phase 1 documentation
4. Upload `pocketbase` to $5 VPS, setup systemd service + Caddy reverse proxy + HTTPS

## 📱 Mobile Wrap
See `docs/capacitor-setup.md`

## 🔧 Admin Workflow
- Toggle subscription: Admin UI → Users → Edit → `subscription_status` → Save
- Create locked channel: Admin UI → Channels → Create → Set `required_tag`
- Backup: Run `bash scripts/backup.sh` daily via cron

## ⚠️ Troubleshooting
- `npm install` fails: `rm -rf node_modules package-lock.json && npm install`
- Port 8090 busy: `./pocketbase serve --http 127.0.0.1:8091`
- Offline queue clears on app restart: Intentional for security. Text messages sync on reconnect.