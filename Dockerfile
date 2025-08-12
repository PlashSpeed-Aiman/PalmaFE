FROM ubuntu:latest
LABEL authors="aiman"

ENTRYPOINT ["top", "-b"]