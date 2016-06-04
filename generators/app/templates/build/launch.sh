#!/usr/bin/env bash

set -e

if [ $# -lt 2 ]
  then
    echo "Usage: $0 id port" && exit
fi

# Bring up new image
echo "Launching $1/web as $1_web..."
ssh $1 "sink $1_web && docker run --name $1_web --restart=always -d -p 127.0.0.1:$2:80 $1/web:latest"
