#!/bin/bash

if [ -n "$QUANT_S3FS_ACCESS_KEY" ] && [ -n "$QUANT_S3FS_SECRET_KEY"] ; then
  echo "$QUANT_S3FS_ACCESS_KEY:$QUANT_S3FS_SECRET_KEY" > ${HOME}/.passwd-s3fs
  chmod 600 ${HOME}/.passwd-s3fs
  s3fs "$QUANT_S3FS_BUCKET" /opt/drupal/sites/default/files -o passwd_file=${HOME}/.passwd-s3fs
fi