FROM node:20-alpine
WORKDIR /app
COPY . .
RUN cat .env
RUN npm install 
EXPOSE 5003
CMD ["node", "index.js"]