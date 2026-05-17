#!/bin/bash
echo "🔒 Starting PocketBase backup..."
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/pb_data.tar.gz" ./pb_data
echo "✅ Backup saved to $BACKUP_DIR"
# Add rclone sync here: rclone copy $BACKUP_DIR remote:pb_backups