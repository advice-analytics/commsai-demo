from fastapi import FastAPI, HTTPException
from typing import List, Optional
import json
import os
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Get the current directory of the script
current_dir = os.path.dirname(__file__)
participants_file_path = os.path.join(current_dir, 'participants.json')
plans_file_path = os.path.join(current_dir, 'plans.json')

# Load data from participants.json and plans.json on startup
try:
    with open(participants_file_path, 'r') as f:
        participants_data = json.load(f)
except FileNotFoundError:
    participants_data = []

try:
    with open(plans_file_path, 'r') as f:
        plans_data = json.load(f)
except FileNotFoundError:
    plans_data = []

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://schwab.commsai.io",  # Update with your frontend URL
    "https://*.dailyvest.com",
    "https://demo-api.commsai.io/"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Endpoint to retrieve all participants
@app.get("/api/participants", response_model=List[dict])
def get_all_participants():
    try:
        with open(participants_file_path, 'r') as f:
            participants_data = json.load(f)
        return participants_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Participants file not found")

# Endpoint to retrieve participant details by ID
@app.get("/api/participants/{participant_id}", response_model=dict)
def get_participant_by_id(participant_id: str):
    for participant in participants_data:
        if participant.get('id') == participant_id:
            return participant
    raise HTTPException(status_code=404, detail="Participant not found")

# Endpoint to retrieve all plans
@app.get("/api/plans", response_model=List[dict])
def get_all_plans():
    try:
        with open(plans_file_path, 'r') as f:
            plans_data = json.load(f)
        return plans_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Plans file not found")

# Endpoint to retrieve plan details by plan name
@app.get("/api/plans/{plan_name}", response_model=dict)
def get_plan_by_name(plan_name: str):
    for plan in plans_data:
        if plan.get('planName') == plan_name:
            return plan
    raise HTTPException(status_code=404, detail="Plan not found")

# Endpoint for OpenAI API proxy
@app.post("/api/openai")
def openai_proxy(prompt: str):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'  # Replace with your OpenAI API key
    }
    data = {
        'prompt': prompt
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    response.raise_for_status()  # Raise exception for non-2xx response codes
    return response.json()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)