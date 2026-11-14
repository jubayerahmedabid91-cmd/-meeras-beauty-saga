#!/usr/bin/env bash
# Auto-restart wrapper for the Next.js production server.
# Keeps the server alive even if it crashes or is killed.
cd "C:/Users/JUBAYER/Downloads/Meeras-Beauty-Saga11/app" || exit 1

while true; do
  echo "[$(date '+%H:%M:%S')] Starting server..."
  npx next start -p 3000
  echo "[$(date '+%H:%M:%S')] Server exited with code $?. Restarting in 2s..."
  sleep 2
done
