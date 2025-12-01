# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VPS Learning Project - a containerized static website hosted with Nginx and Docker Compose. The project demonstrates basic Docker orchestration and web server configuration for hosting static content.

**Domain:** skudva.com (configured in nginx.conf)
**Current Branch:** dev

## Common Commands

### Running the Application

**Local Development (Port 8080):**
```bash
# Start the nginx service
docker-compose up -d

# Access at: http://localhost:8080
```

**VPS Production (Port 80):**
```bash
# Start without override file
docker-compose -f docker-compose.yml up -d

# Access at: http://skudva.com
```

**Other Commands:**
```bash
# Stop the service
docker-compose down

# View logs
docker-compose logs -f nginx

# Restart after nginx.conf changes
docker-compose restart nginx
```

## Architecture

### Container Structure
- Single nginx container serving static HTML
- Port mapping:
  - **Local:** 8080:80 (via docker-compose.override.yml)
  - **VPS:** 80:80 (docker-compose.yml)
- Volume mounts for live-reload development:
  - `./nginx.conf` → `/etc/nginx/conf.d/default.conf`
  - `./html/` → `/usr/share/nginx/html`

### File Organization
- **docker-compose.yml** - Production config (port 80)
- **docker-compose.override.yml** - Local dev config (port 8080, gitignored)
- **nginx.conf** - Web server configuration (SPA-ready with try_files fallback)
- **html/** - Static website content directory

## Development Notes

### Making Changes
- **HTML/CSS/JS changes:** Edit files in `./html/` - changes are immediately visible (volume-mounted)
- **Nginx config changes:** Edit `nginx.conf`, then run `docker-compose restart nginx`

### Nginx Configuration
The nginx.conf uses `try_files $uri $uri/ /index.html` pattern, which supports:
- Static file serving
- Single-page application (SPA) routing fallback

### Docker Volume Mounts
Both configuration and content use volume mounts rather than copying files into the image, enabling rapid local development without rebuilds.
