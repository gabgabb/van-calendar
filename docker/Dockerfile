FROM node:22

# Enable Corepack
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY ./package.json ./yarn.lock ./
RUN yarn install --immutable

# Copy the project files
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Expose environmen port 3000
EXPOSE 3000

# Start command
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then corepack yarn build && corepack yarn start; else corepack yarn dev; fi"]