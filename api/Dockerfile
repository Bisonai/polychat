# Use the official Node.js Alpine image with the specified version
FROM node:18.12.1-alpine

# Update the package repository and install curl
RUN apk update && apk add --no-cache curl

# Set the working directory to /app
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the remaining project files
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Set the command to start the application
CMD ["yarn", "start"]
