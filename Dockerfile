FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g ts-node

# Copy source files
COPY . .
