from fastapi import FastAPI, HTTPException, Response
from typing import List, Optional
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse

app = FastAPI()

# Load data from JSON files on startup
current_dir = os.path.dirname(__file__)
participants_file_path = os.path.join(current_dir, 'participants.json')
plans_file_path = os.path.join(current_dir, 'plans.json')

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

# Define allowed origins
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://demo.commsai.io",
    "https://aadev.dailyvest.com",
    "http://localhost:8000" 
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Allow both GET and POST methods
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
    max_age=3600
)

def create_response(data):
    response = Response(content=json.dumps(data), media_type="application/json")
    response.headers["Content-Security-Policy"] = "default-src 'self'; connect-src 'self' http://localhost:3000 https://demo.commsai.io https://aadev.dailyvest.com http://localhost:8000"
    return response

# Endpoint to retrieve all participants
@app.get("/api/participants", response_model=List[dict])
@app.post("/api/participants", response_model=List[dict])  # Handle POST requests as well
def get_all_participants():
    return create_response(participants_data)

# Endpoint to retrieve participant details by ID
@app.get("/api/participants/{participant_id}", response_model=dict)
def get_participant_by_id(participant_id: str):
    for participant in participants_data:
        if participant.get('id') == participant_id:
            return create_response(participant)
    raise HTTPException(status_code=404, detail="Participant not found")

# Endpoint to retrieve all plans
@app.get("/api/plans", response_model=List[dict])
def get_all_plans():
    return create_response(plans_data)

# Endpoint to retrieve plan details by plan name
@app.get("/api/plans/{plan_name}", response_model=dict)
def get_plan_by_name(plan_name: str):
    for plan in plans_data:
        if plan.get('planName') == plan_name:
            return create_response(plan)
    raise HTTPException(status_code=404, detail="Plan not found")

# Example endpoint to serve HTML content
@app.get("/api/html-content", response_class=HTMLResponse)
def get_html_content():
    # Read HTML content from a file, template, or generate dynamically
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>HTML Content</title>
    </head>
    <body>
        <h1>Hello, HTML Content!</h1>
        <p>This is some example HTML content.</p>
    </body>
    </html>
    """
    return html_content

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
