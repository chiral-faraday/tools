FROM node:22-bookworm
WORKDIR /app
COPY ../backend/package*.json ./
RUN npm install
COPY ../backend .
EXPOSE 3000
CMD ["npm", "run", "dev"]
