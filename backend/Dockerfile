# DB connection arguments
# endpoint
ARG DB_EP 
# port
ARG DB_PT
# user
ARG DB_US
# password
ARG DB_PW

FROM python:3.10.9-alpine3.17
WORKDIR /backend
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV DJANGO_SETTINGS_MODULE=kanban.settings
EXPOSE 8000
CMD python manage.py runserver 0.0.0.0:8000