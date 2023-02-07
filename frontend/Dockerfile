FROM node:19.3.0-alpine3.17

WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD serve -s build 