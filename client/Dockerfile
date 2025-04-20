FROM node:20
WORKDIR /app
COPY . .
EXPOSE 5173
RUN rm -rf node_modules package-lock.json && npm install
CMD ["npm", "run", "dev"]
