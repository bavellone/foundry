#!/usr/bin/env bash

set -e

if [ $# -lt 2 ]
  then
    echo "Usage: $0 host image" && exit
fi

# Send image to deployment server
echo "Sending $2 to $1..."
docker save $2 | pv -cN gzip -s 500m | gzip | pv -cN xfer | ssh $1 "gunzip | docker load"
