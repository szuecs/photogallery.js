#!/bin/sh

PIC_DIR=$1
if [ -f $1/TODO ]
then
  rm -f $1/TODO
fi
if [ -f $1/thumb/TODO ]
then
  rm -f $1/thumb/TODO
fi

erb gallery_target_dir.erb

