# Kanban board site
For self learning purposes, build a kanban board site

Follow development [here](https://github.com/ccarb/Kanban/projects)

## Installation
### Backend server
This project uses pyhton 3.10 and django 4.1.4
```
sudo apt-get install python3.10
sudo apt-get install python3-pip
sudo apt-get install python3-venv
```

Then we create a virtual environment for the project
```
python -m venv env
pip install -r Requirements.txt
```

Run development backend server with
```
cd backend
python manage.py runserver
```
### Frontend server
This project uses nodejs v19.3.0 and npm 9.2.0

I installed them using nvm (using instructions from nvm's github)
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 19.3.0
```

Run frontend server with
```
cd frontend
npm start
```
