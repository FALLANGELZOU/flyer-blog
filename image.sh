#!/bin/bash
echo "开始编译前端程序"
npm run build 
echo "开始编译docker镜像"
docker image build --platform linux/amd64 -t 'lightsssun/flyer-blog:latest' .
echo "删除悬空镜像"
docker image prune -f
echo "开始推送镜像"
docker push lightsssun/flyer-blog:latest
echo "完成"