#!/bin/sh
docker pull richardchien/cqhttp:latest

docker rm coolq -f

rm -rf /root/coolq-data
mkdir /root/coolq-data

docker run -tid \
 --name coolq \
 -v /root/coolq-data:/home/user/coolq \
 -p 9000:9000 \
 -p 5700:5700 \
 -p 5600:5600 \
 -e VNC_PASSWD=password \
 -e COOLQ_URL=http://dlsec.cqp.me/cqp-tuling \
 -e CQHTTP_POST_URL=http://127.0.0.1:5800 \
 -e CQHTTP_SERVE_DATA_FILES=yes \
 richardchien/cqhttp:latest
