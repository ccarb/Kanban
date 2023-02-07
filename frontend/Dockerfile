FROM node:19.3.0-alpine3.17

WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD serve -s build 