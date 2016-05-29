#!/usr/bin/env bash

set -e

if [ $# -lt 2 ]
  then
    echo "Usage: $0 name version" && exit
fi

# Build image
echo "Building $1/web:$2..."
docker build -t $1/web . # Build image and tag as latest
docker tag $1/web:latest $1/web:${2} # Tag image version
