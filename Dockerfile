FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's source code and build the production-ready files
COPY . ./
RUN npm run build

# Use an Nginx image to serve the built app
FROM nginx:alpine

# Copy the built files to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 4000
EXPOSE 4000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]