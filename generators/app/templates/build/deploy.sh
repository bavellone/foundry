#!/bin/bash

set -e

if [ $# -lt 3 ]
  then
    echo "Usage: $0 name version port" && exit
fi

# Build image
echo "Building $1/web:$2..."
docker build -t $1/web . # Build image and tag as latest
docker tag $1/web:latest $1/web:${2} # Tag image version

# Send image to deployment server
echo "Sending image to deployment server..."
./build/transfer.sh $1 "$1/web:$2"

# Tag as latest
ssh $1 "docker tag -f $1/web:$2 $1/web:latest"

# Save logs of previous app
ssh $1 "docker logs $1_web &>> ~/logs/$1.log"

# Bring up new image
echo "Launching new image..."
./build/launch.sh $1 $3
