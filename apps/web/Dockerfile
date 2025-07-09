    FROM node:20

    WORKDIR /app
    COPY . .  
    
    RUN npm install 
    RUN npm run build:base

    WORKDIR /app/apps/web
    RUN npm run build
    
    EXPOSE 3000
    ENV NODE_ENV=production
    CMD ["npm", "start"]