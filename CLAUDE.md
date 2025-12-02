# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VPS Learning Project - a containerized static website hosted with Nginx and Docker Compose. The project demonstrates basic Docker orchestration, web server configuration, and HTTPS setup with Let's Encrypt SSL certificates.

**Domain:** skudva.com (with HTTPS)
**Current Branch:** dev
**Production:** HTTPS enabled with Let's Encrypt
**Local Development:** HTTP only (no SSL required)

## Common Commands

### Running the Application

**Local Development (Port 8080):**
```bash
# Start the nginx service
docker compose up -d

# Access at: http://localhost:8080
```

**VPS Production (Ports 80 & 443 with HTTPS):**
```bash
# Start without override file
docker compose -f docker-compose.yml up -d

# Access at: https://skudva.com
# Note: Port 80 automatically redirects to HTTPS
```

**Other Commands:**
```bash
# Stop the service
docker compose down

# View logs
docker compose logs -f nginx

# Restart after nginx.conf changes
docker compose restart nginx
```

## Architecture

### Container Structure
- Single nginx container serving static HTML
- Port mapping:
  - **Local:** 8080:80 (HTTP only, via docker-compose.override.yml)
  - **VPS:** 80:80 + 443:443 (HTTP redirects to HTTPS, docker-compose.yml)
- Volume mounts:
  - **Configuration:** `./nginx.conf` or `./nginx.override.conf` → `/etc/nginx/conf.d/default.conf`
  - **Content:** `./html/` → `/usr/share/nginx/html`
  - **SSL Certificates (VPS only):** `/etc/letsencrypt` → `/etc/letsencrypt:ro`

### File Organization
- **docker-compose.yml** - Production config (ports 80 & 443, HTTPS with Let's Encrypt)
- **docker-compose.override.yml** - Local dev config (port 8080, HTTP only, gitignored)
- **nginx.conf** - Production web server config (HTTPS with SSL certificates, HTTP→HTTPS redirect)
- **nginx.override.conf** - Local web server config (HTTP only, no SSL)
- **html/** - Static website content directory

## Development Notes

### Making Changes
- **HTML/CSS/JS changes:** Edit files in `./html/` - changes are immediately visible (volume-mounted)
- **Nginx config changes:**
  - Local: Edit `nginx.override.conf`, then run `docker compose restart nginx`
  - VPS: Edit `nginx.conf`, then run `docker compose -f docker-compose.yml restart nginx`

### HTTPS/SSL Configuration

**Production (VPS):**
- Uses Let's Encrypt SSL certificates
- HTTP (port 80) automatically redirects to HTTPS (port 443)
- Certificates mounted from `/etc/letsencrypt` on the host
- SSL configuration in nginx.conf:11-28

**Local Development:**
- HTTP only (no SSL certificates needed)
- Uses `nginx.override.conf` without SSL configuration
- Accessible via `http://localhost:8080`

### Nginx Configuration
Both nginx configs use `try_files $uri $uri/ /index.html` pattern, which supports:
- Static file serving
- Single-page application (SPA) routing fallback

### Docker Volume Mounts
Both configuration and content use volume mounts rather than copying files into the image, enabling rapid local development without rebuilds.
