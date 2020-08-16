FROM debian:buster-slim

# ensure local python is preferred over distribution python
ENV PATH /usr/local/bin:$PATH

# http://bugs.python.org/issue19846
# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.
ENV LANG C.UTF-8

RUN apt-get update -y \
    && apt-get -y install python3 \
    && apt-get install python3-pip -y

# make some useful symlinks that are expected to exist
RUN cd /usr/local/bin \
    && ln -s idle3 idle \
    && ln -s pydoc3 pydoc \
    && ln -s python3 python \
    && ln -s python3-config python-config


WORKDIR /home/node/template/src

COPY . .

RUN pip3 install sqlalchemy
RUN pip3 install pyocclient
RUN pip3 install pymysql

CMD [ "python3", "Main.py" ]