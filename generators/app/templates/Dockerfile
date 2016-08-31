FROM mhart/alpine-node

RUN mkdir /data
WORKDIR /app

# Env vars
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 80
ENV DEBUG app:*
ENV TZ=America/Chicago

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install deps
COPY package.json package.json
RUN npm install

# Copy over app data
COPY server server
COPY client client
COPY assets assets
COPY shared shared
COPY config config
COPY .babelrc .babelrc
COPY server.js server.js

EXPOSE 80
CMD ["node", "server.js"]
