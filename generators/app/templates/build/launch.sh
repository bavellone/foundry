#!/usr/bin/env bash

set -e

if [ $# -lt 3 ]
  then
    echo "Usage: $0 host image name [args]" && exit
fi

# Bring up new image
echo "Launching $2 - $3 on host $1 with args '$4'..."
ssh $1 "sink $3 && docker run --restart=always --name $3 -d $4 $2"
