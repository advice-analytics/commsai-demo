from fastapi import FastAPI
import firebase_admin
# from firebase_admin import credentials, db, auth
app = FastAPI()

@app.get("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"
