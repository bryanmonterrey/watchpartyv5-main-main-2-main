#!/bin/bash
yum update -y
yum install -y amazon-efs-utils nginx
amazon-linux-extras install epel -y
yum install -y nginx-mod-rtmp
mkdir -p /mnt/efs
mount -t efs -o tls fs-0a8f6609bdc5b889d:/ /mnt/efs
cat << 'EOFNGINX' > /etc/nginx/nginx.conf
events {}
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        application live {
            live on;
            record off;
        }
    }
}
http {
    server {
        listen 80;
        server_name localhost;
        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
}
EOFNGINX
systemctl start nginx
systemctl enable nginx
