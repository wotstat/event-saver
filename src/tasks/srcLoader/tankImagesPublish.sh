#!/bin/bash
# Copy to /gui-part/gui/maps/icons/vehicle/tankImagesPublish.sh

aws --endpoint-url=https://storage.yandexcloud.net/ \
  s3 cp ./ s3://static.wotstat.info/vehicles/preview \
  --recursive \
  --exclude "*" \
  --include "*.png" \
  --exclude "*/**" \
  --cache-control 'max-age=31622400' \
  --profile wotstat