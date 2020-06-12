FROM node:alpine
WORKDIR /app
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]