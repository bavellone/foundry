#!/usr/bin/env bash

if [ $# -eq 0 ]
  then echo Usage: $0 version
  exit
fi

VERSION=$1
RELEASE=release/$VERSION

git checkout dev
git checkout -b $RELEASE
git commit -a -m "version bump"
git checkout dev
git merge --no-ff --no-edit $RELEASE
git checkout master
git merge --no-ff --no-edit $RELEASE
