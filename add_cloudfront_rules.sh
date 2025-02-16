#!/bin/bash

SG_ID="sg-04c1e413fcd6c35d8"

while IFS= read -r ip_range
do
  aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr "$ip_range"
done < cloudfront_ips.txt