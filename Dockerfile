FROM node:18-slim

# Install necessary packages for puppeteer
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm-dev \
    libxshmfence-dev \
    && rm -rf /var/lib/apt/lists/*

# Set up working dir
WORKDIR /app

# Install Puppeteer (includes Chromium)
COPY package.json ./
RUN npm install

# Copy files
COPY render.js viewer.html entrypoint.sh ./

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
