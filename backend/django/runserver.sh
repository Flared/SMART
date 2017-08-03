#!/bin/bash

if [ "$SMART_ENV" = 'prod' ]; then
	python manage.py collectstatic -c --noinput
    gunicorn --bind=0.0.0.0:8000 -w 4 -k gevent -t 60 smart.wsgi
else
    python manage.py runserver 0.0.0.0:8000
fi
