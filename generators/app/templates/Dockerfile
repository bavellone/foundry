FROM bavellone/nodejs

# Env vars
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# Install tools
RUN npm install -g bower

# Install deps
COPY package.json package.json
RUN npm --production=false install 

COPY bower.json bower.json
RUN bower install --allow-root

# Copy over app data
COPY server server
COPY public public
COPY gulpfile.js server.js ./

# Create asset bundles
RUN npm run build
