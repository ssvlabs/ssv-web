FROM mhart/alpine-node:slim-14

ENV APP_WORKDIR=/builds/bloxapp/ssv-web

COPY . $APP_WORKDIR
WORKDIR $APP_WORKDIR

ARG S3_BUCKET
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG BUILD_ENV

RUN apk update && apk upgrade && \
    apk add --virtual build-deps git gcc make g++ py-pip curl --no-cache \
        nodejs \
        yarn
RUN apk add npm && npm install && npm audit fix && pip install awscli

RUN BUILD_ENV=$BUILD_ENV yarn build

RUN aws configure set region us-west-2
RUN aws s3 cp build/ s3://$S3_BUCKET/ --recursive
