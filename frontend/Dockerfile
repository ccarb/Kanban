FROM node:19.3.0-alpine3.17

WORKDIR /frontend
COPY . .
RUN npm install
ENV CHECKLIST_API_URL="http://ccarb-sandbox.click:8000/api/checklists/"
ENV KANBAN_API_URL="http://ccarb-sandbox.click:8000/api/kanban/"
ENV BOARD_API_URL="http://ccarb-sandbox.click:8000/api/boards/"
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD serve -s build 