FROM node:lts-bookworm-slim
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -ms /bin/bash toolsdev
COPY backend/package.json backend/package-lock.json ./
RUN npm ci -y
COPY backend/ .
RUN chown -R toolsdev:toolsdev /usr/src/app
USER toolsdev
EXPOSE 3000
CMD ["npm", "run", "start"]
