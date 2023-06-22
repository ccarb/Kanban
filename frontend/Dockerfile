FROM node:19.3.0-alpine3.17

WORKDIR /frontend
COPY . .
RUN npm install
ENV REACT_APP_CHECKLIST_API_URL="http://ccarb-sandbox.click:8000/api/checklists/"
ENV REACT_APP_KANBAN_API_URL="http://ccarb-sandbox.click:8000/api/kanban/"
ENV REACT_APP_BOARD_API_URL="http://ccarb-sandbox.click:8000/api/boards/"
ENV REACT_APP_AUTH_API_URL="http://ccarb-sandbox.click:8000/api/auth"
ENV REACT_APP_ONBOARDING_API_URL="http://ccarb-sandbox.click:8000/api/signup"
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD serve -s build 
