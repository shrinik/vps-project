# My Learning Project


## Background
I have always wanted to start my own blog with technical writeups and working demos. My goal is to level up my skills and also share my knowledge with others. 

### Current Accomplishments
1. Buy a domain and cloud server
2. Setup my blog using Hugo and nginx
3. Setup an observability stack using Grafana, Prometheus and Loki.

### Next Steps
1. Write at least one technical article per month
2. Push frontend & backend logs to Loki
3. Learn more about observability

## Technical Stack
- Docker Compose used to run all services.
- Static blog served using nginx
- nginx is also used as a reverse proxy for grafana.
- Observability stack for nginx (and future services) using Grafana for visualization, Prometheus for scraping metrics and Loki for log aggregation. All these services are run in docker containers.
- Prometheus Node Exporter is used to export host machine metrics for Prometheus to scrape.


## Project Structure
- my-blog - Folder containing blog using Hugo Static Site Generator
- local-conf - Folder containing nginx and docker configuration files to enable local development using http instead of https
- docker-compose.yml - Docker compose configuration file
- nginx.conf - nginx configuration file in production
- prometheus.yml - Prometheus configuration file
- loki-config.yaml - Loki configuration file

## Prerequisites
Linux (I use Ubuntu), docker and docker compose.


## Setup

1. Clone the repo locally. The static files are already present in the my-blog/public folder so you don't have to install hugo right away. When you are ready to start with your blog then you can follow my [Hugo tutorial](https://www.skudva.com/2025/12/blogging-using-hugo/).

2. Download the linux version of [Prometheus Node Exporter](https://prometheus.io/download/).
```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-amd64.tar.gz
```

3. Install it following this [tutorial from Couchbase](https://developer.couchbase.com/tutorial-node-exporter-setup/). This tutorial considers that Couchbase DB will use port 9100 (which is also the default port used by node-exporter) hence it uses port 9200 for node-exporter. So change the line in node_exporter.service file from **--web.listen-address=:9200** to **--web.listen-address=:9100**

4. Run the below command to start all the services.
```bash
docker compose up
```

5. Starting nginx without TLS certificates will result in an error. Hence, comment out the below SSL lines temporarily, get your certificates via [my tutorial](https://www.skudva.com/2025/12/automate-tls-certificate-renewal-for-nginx-with-certbot/), then uncomment. 
```toml
# SSL certificate paths (inside container)
ssl_certificate /etc/letsencrypt/live/skudva.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/skudva.com/privkey.pem;

# SSL configuration for security
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
```

6. Once the TLS certificate is issued, you can uncomment the lines from step 5

## Accessing the services
- The blog can be accessed on the main domain - skudva.com or www.skudva.com
- The grafana dashboard can be accessed on the subdomain - grafana.skudva.com

## Note on local development
- Copy the local-conf/nginx.conf and local-conf/docker-compose.yml to the root folder before running "docker compose up" in local so that you can access the blog and grafana using http instead of https.
- To configure grafana on a localhost subdomain, do the following.
    - Open the hosts file for editing using command below.
    ```bash
    sudo nano /etc/hosts
    ```
    - Add below line at the end without changing any existing lines.
    > 127.0.0.1 grafana.localhost
