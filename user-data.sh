#!/bin/bash
yum update -y
yum install -y amazon-efs-utils nginx

# Mount EFS
mkdir -p /mnt/efs
mount -t efs -o tls fs-0a8f6609bdc5b889d:/ /mnt/efs

# Start Nginx
systemctl start nginx
systemctl enable nginx