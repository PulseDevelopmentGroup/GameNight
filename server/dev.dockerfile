FROM node:alpine
WORKDIR /app
ENTRYPOINT ["npm", "run", "watch"]