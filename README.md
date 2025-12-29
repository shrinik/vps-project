# My Learning Project


## Background
I have always wanted to start my own blog with technical writeups and working demos. My goal is to level up my skills and also share my knowledge with others. This is what I have accomplished so far -
1. Buy a domain and cloud server
2. Setup my blog using Hugo and nginx
3. Setup an observability stack using Grafana, Prometheus and Loki.

## Setup

1. Download the linux version of [Prometheus Node Exporter](https://prometheus.io/download/).
```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-amd64.tar.gz
```
 2. Install it following this [tutorial from Couchbase](https://developer.couchbase.com/tutorial-node-exporter-setup/). 
 
 3. When copying the configuration into node_exporter.service file, change the port from 9200 to 9100 (default port). This should be done in the below line in the file.
 > --web.listen-address=:9200

4. Run the below command to start all the services.
```bash
docker compose up
```

5. Nginx container will error in case the public and private keys are not present in the locations given in the nginx.conf file so you can comment below lines until you get the TLS certificates for the main domain and subdomain(s).
```toml
# SSL certificate paths (inside container)
ssl_certificate /etc/letsencrypt/live/skudva.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/skudva.com/privkey.pem;

# SSL configuration for security
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
```

6. Follow my [tutorial](https://www.skudva.com/2025/12/automate-tls-certificate-renewal-for-nginx-with-certbot/) to obtain and automatically renew a TLS certificate.

7. Once the TLS certificate is issued, you can uncomment the lines from step 5.