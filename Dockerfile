FROM node:latest
RUN apt-get update && apt-get install -y vim
WORKDIR /usr/local/hubot
CMD tail -f /dev/null
