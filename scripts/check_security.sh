#!/bin/bash

docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://app.stage.ssv.network/
