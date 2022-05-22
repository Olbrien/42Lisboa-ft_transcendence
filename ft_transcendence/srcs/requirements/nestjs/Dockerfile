FROM node:latest

# Copy startup.sh
COPY /tools/startup.sh /tmp/

# Create app directory
WORKDIR /usr/src/app

# Copy app dependencies
COPY /app-volume/package*.json ./

# Just doing npm@latest doesn't install the necessary dependencies.
# You need to npm install it first then upgrade it.
RUN npm install
RUN npm install -g npm@latest

# Bundle app source
COPY /app-volume/ .

RUN npm run build

ENTRYPOINT ["sh","-c", "/bin/bash /tmp/startup.sh;"]