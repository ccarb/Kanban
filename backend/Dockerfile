FROM python:3.10.9-alpine3.17

WORKDIR /backend
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
ENV DJANGO_SETTINGS_MODULE=kanban.settings
ENV SECRET_KEY=123qweasd
EXPOSE 8000
CMD python manage.py runserver 0.0.0.0:8000