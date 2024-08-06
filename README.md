# React/trame application 

Requires a paraview 5.10+

## Virtual environment

```sh
virtualenv .venv
source .venv/bin/activate
pip install -r trame-app/requirements.txt
```

## trame application

### Run trame-app
```sh
cd trame-app
path/to/pvpython ./app.py --port 8080 --server --venv absolute/path/to/.venv
```

## React Application

### Setup
In an other terminal:

```sh
npm install
```

### Apps communication
Before launching the streamlit app, please modify
.venv/lib/python3.9/site-packages/trame_iframe/module/serve/trame-iframe.umd.js file:

Change in "Communicator" section:

```sh
window.postMessage(e,"*");
```

by

```sh
window.top.postMessage(e,"*");
```

Open localhost:8081 on your web browser