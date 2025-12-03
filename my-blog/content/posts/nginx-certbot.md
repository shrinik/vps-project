+++
date = '2025-12-03T18:13:57Z'
draft = false
title = "Auto-Renewing Let's Encrypt Certificates for nginx with Certbot Webroot"
+++

## Background
I use a cloud server running nginx to serve my web applications including this blog. I use docker compose to run the nginx container on my web server. To serve the site securely, I used Certbot to issue a TLS certificate for my domain. This post captures the steps and learning.

## Glossary
- **nginx** - A high performance web server software.
- **TLS** - Transport Layer Security is a cryptographic protocol for secure communication over the internet.
- **TLS certificate** - Digital file that proves a website's identity to TLS.
- **Certbot** - An open-source tool to automate the process of obtaining and renewing free TLS certificates from Let's Encrypt.
- **Let's Encrypt** - Let's Encrypt is a Certificate Authority that provides free TLS certificates.
- **ACME** - Automatic Certificate Management Environment is a protocol for automating the process for obtaining/renewing TLS certificates

## Assumptions
 - You are running nginx on ubuntu linux
 - You are using docker-compose to run nginx
 - You are logged in as root. If not, prefix "sudo" to all commands

## Why
Let's Encrypt certificates are valid only for 90 days so it is essential to setup an automated mechanism to renew the certificate in order to keep the site secure and accessible.

There are multiple methods to obtain and renew certificates with Certbot. The **webroot method** is particularly useful because it allows Certbot to renew certificates without stopping the web server software (nginx), ensuring zero downtime during renewal.

## Steps

### Install Certbot using snap
```bash
snap install --classic certbot
```

### Create webroot directory for Certbot
```bash
mkdir -p /var/www/certbot
```

### Update nginx configuration
The `/var/www/certbot` directory is mapped to a specific URL path that is used by the Certbot snap running on the web server to verify the ownership of the domain. 

Basically, Certbot will generate and store a token in this directory and navigate to your domain using the domain name and above path. 

If the token retrieved from the navigation matches the one generated on the web server, it verifies that the web server owns the domain and hence can be issued a TLS certificate for that domain.

Note that the redirect block must be wrapped in a location block else it will run before any location block and redirect everything including the ACME challenge which will cause the Hugo html page to be served.
```nginx
server {
    listen 80;
    server_name skudva.com www.skudva.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all OTHER requests to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

### Mount the webroot to nginx
The `/var/www/certbot` directory on the web server is mapped to the equivalent directory in the docker container running nginx.
```yaml
services:
  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./public:/usr/share/nginx/html:ro
      - /var/www/certbot:/var/www/certbot:ro
    restart: unless-stopped
```
### Generate the certificate
```bash
certbot certonly --webroot -w /var/www/certbot -d skudva.com -d www.skudva.com
```

### Verify the certificate
After generation, verify the certificate was created:
```bash
ls -la /etc/letsencrypt/live/skudva.com/
```

You should see `fullchain.pem` and `privkey.pem` files.

## Conclusion
Following the above steps ensures Certbot can auto-renew the certificate without you having to stop nginx. Certbot automatically creates a systemd timer that runs twice daily to check and renew certificates that are within 30 days of expiration. You can check the renewal timer status with:
```bash
systemctl status snap.certbot.renew.timer
```

To test the renewal process without actually renewing:
```bash
certbot renew --dry-run
```