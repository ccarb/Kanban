coverage run --source='.' --omit='kanban/asgi.py','kanban/wsgi.py','kanban/settings.py','manage.py' manage.py test
coverage html