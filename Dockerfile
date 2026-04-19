FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --prefix backend
EXPOSE 5180
CMD ["node", "backend/server.js"]
