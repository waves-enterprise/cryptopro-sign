# Базовый образ с КриптоПро
FROM node:stretch-slim as cryptopro-generic

# Устанавливаем timezone
ENV TZ="Europe/Moscow" \
    docker="1" \
    CERTIFICATE_PIN=${CERTIFICATE_PIN:-} \
    ESIA_ENVIRONMENT=${ESIA_ENVIRONMENT:-test}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

ADD cryptopro/install /tmp/src
RUN cd /tmp/src && \
    tar -xf linux-amd64_deb.tgz && \
    linux-amd64_deb/install.sh && \
    # делаем симлинки
    cd /bin && \
    ln -s /opt/cprocsp/bin/amd64/certmgr && \
    ln -s /opt/cprocsp/bin/amd64/cpverify && \
    ln -s /opt/cprocsp/bin/amd64/cryptcp && \
    ln -s /opt/cprocsp/bin/amd64/csptest && \
    ln -s /opt/cprocsp/bin/amd64/csptestf && \
    ln -s /opt/cprocsp/bin/amd64/der2xer && \
    ln -s /opt/cprocsp/bin/amd64/inittst && \
    ln -s /opt/cprocsp/bin/amd64/wipefile && \
    ln -s /opt/cprocsp/sbin/amd64/cpconfig && \
    # прибираемся
    rm -rf /tmp/src

RUN apt-get update && apt-get install -y --no-install-recommends expect libboost-dev unzip g++ curl

ADD cryptopro/scripts /cryptopro/scripts
ADD cryptopro/esia cryptopro/esia
RUN chmod 755 /cryptopro/scripts/ -R

FROM cryptopro-generic
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY versions.json .
COPY nest-cli.json .
COPY src .
RUN npm ci -q
RUN npm run build
RUN npm prune --production

EXPOSE 3037
CMD /cryptopro/scripts/start.sh