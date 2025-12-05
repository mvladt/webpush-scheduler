FROM node:22.18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE $PORT
CMD ["npm", "run", "start"]
