# Multi-stage Dockerfile for MERN app

# Stage 1: Build the React client
FROM node:18-alpine AS client-build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Stage 2: Build and run the server
FROM node:18-alpine AS server
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Copy the built React app from the client-build stage
COPY --from=client-build /app/dist ./client/dist

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]