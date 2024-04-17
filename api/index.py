from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Placeholder route to test the API
@app.get("/api/python")
def hello_world():
    return {"message": "Hello, World!"}


# Endpoint for uploading plan data
class UploadPlanDataRequest(BaseModel):
    file: UploadFile

@app.post("/v1/admin/upload/plan-data", status_code=201)
def upload_plan_data_v1_admin_upload_plan_data_post(request: UploadPlanDataRequest):
    try:
        # Process the uploaded file (request.file) here
        # Example: Save the file to a specific location or perform processing
        return JSONResponse(content={"message": "Plan data uploaded successfully"})
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for uploading advisor data
class UploadAdvisorDataRequest(BaseModel):
    file: UploadFile

@app.post("/v1/admin/upload/advisor-data", status_code=201)
def upload_advisor_data_v1_admin_upload_advisor_data_post(request: UploadAdvisorDataRequest):
    try:
        # Process the uploaded file (request.file) here
        # Example: Save the file to a specific location or perform processing
        return JSONResponse(content={"message": "Advisor data uploaded successfully"})
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for creating an admin partner
class CreateAdminPartnerRequest(BaseModel):
    name: str
    external_id: str

class CreateAdminPartnerResponse(BaseModel):
    id: str
    license_validity: str
    external_id: str

@app.post("/v1/admin/partner/", response_model=CreateAdminPartnerResponse, status_code=201)
def create_partner_v1_admin_partner__post(request: CreateAdminPartnerRequest):
    try:
        # Example: Generate partner_id and save partner details
        partner_id = "generated_partner_id"
        # Save partner details to database or perform desired actions
        return CreateAdminPartnerResponse(id=partner_id, license_validity="2024-01-01", external_id=request.external_id)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for retrieving admin partners
class GetAdminPartnerResponse(BaseModel):
    id: str
    license_validity: str
    name: str
    tier: str
    external_id: str

@app.get("/v1/admin/partner/", response_model=List[GetAdminPartnerResponse])
def get_partner_v1_admin_partner__get(name: Optional[str] = None, tier: Optional[str] = None):
    try:
        # Example: Fetch partner data based on provided parameters
        # Retrieve partner(s) from database or other data source
        # Return a list of GetAdminPartnerResponse objects
        partners = [
            GetAdminPartnerResponse(id="partner_id_1", license_validity="2024-01-01", name="Partner 1", tier="Tier A", external_id="ext_id_1"),
            GetAdminPartnerResponse(id="partner_id_2", license_validity="2024-01-01", name="Partner 2", tier="Tier B", external_id="ext_id_2")
        ]
        return partners
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for creating an admin data partner
class CreateAdminDataPartnerRequest(BaseModel):
    name: str
    external_id: str

class GetAdminDataPartnerResponse(BaseModel):
    id: str
    name: str
    external_id: str

@app.post("/v1/admin/data-partner/", response_model=GetAdminDataPartnerResponse, status_code=201)
def create_data_partner_v1_admin_data_partner__post(request: CreateAdminDataPartnerRequest):
    try:
        # Example: Generate data_partner_id and save data partner details
        data_partner_id = "generated_data_partner_id"
        # Save data partner details to database or perform desired actions
        return GetAdminDataPartnerResponse(id=data_partner_id, name=request.name, external_id=request.external_id)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/v1/admin/data-partner/", response_model=List[GetAdminDataPartnerResponse])
def get_data_partner_v1_admin_data_partner__get(name: Optional[str] = None):
    try:
        # Example: Fetch data partner(s) based on provided parameters
        # Retrieve data partner(s) from database or other data source
        # Return a list of GetAdminDataPartnerResponse objects
        data_partners = [
            GetAdminDataPartnerResponse(id="data_partner_id_1", name="Data Partner 1", external_id="ext_id_1"),
            GetAdminDataPartnerResponse(id="data_partner_id_2", name="Data Partner 2", external_id="ext_id_2")
        ]
        return data_partners
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for creating an admin plan
class CreateAdminPlanRequest(BaseModel):
    name: str
    external_id: str
    partner_id: str
    data_partner_id: str

class GetAdminPlanResponse(BaseModel):
    id: str
    name: str
    external_id: str
    partner_id: str
    data_partner_id: str

@app.post("/v1/admin/plan/", response_model=GetAdminPlanResponse, status_code=201)
def create_plan_v1_admin_plan__post(request: CreateAdminPlanRequest):
    try:
        # Example: Generate plan_id and save plan details
        plan_id = "generated_plan_id"
        # Save plan details to database or perform desired actions
        return GetAdminPlanResponse(id=plan_id, name=request.name, external_id=request.external_id, partner_id=request.partner_id, data_partner_id=request.data_partner_id)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/v1/admin/plan/", response_model=List[GetAdminPlanResponse])
def get_plan_v1_admin_plan__get(name: Optional[str] = None, external_id: Optional[str] = None):
    try:
        # Example: Fetch plan(s) based on provided parameters
        # Retrieve plan(s) from database or other data source
        # Return a list of GetAdminPlanResponse objects
        plans = [
            GetAdminPlanResponse(id="plan_id_1", name="Plan 1", external_id="ext_id_1", partner_id="partner_id_1", data_partner_id="data_partner_id_1"),
            GetAdminPlanResponse(id="plan_id_2", name="Plan 2", external_id="ext_id_2", partner_id="partner_id_2", data_partner_id="data_partner_id_2")
        ]
        return plans
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for creating a new plan by advisor
class CreateNewPlanRequest(BaseModel):
    plan_name: str
    plan_details: str
    plan_file: UploadFile

@app.post("/v1/advisor/plan/", status_code=201)
def create_new_plan_v1_advisor_plan__post(request: CreateNewPlanRequest):
    try:
        # Process the uploaded plan file and create a new plan
        # Example: Save the plan file, plan_name, and plan_details to the database or storage
        return JSONResponse(content={"message": "New plan created successfully"})
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


# Endpoint for retrieving plan details by advisor
class GetAdvisorPlanResponse(BaseModel):
    id: str
    name: str
    partner: GetAdminPartnerResponse
    data_partner: GetAdminDataPartnerResponse
    advisors: List[str]
    external_id: Optional[str]

class GetAdvisorPlanPartnerResponse(BaseModel):
    id: str
    name: str
    external_id: str

@app.get("/v1/advisor/plan/{plan_id}", response_model=GetAdvisorPlanResponse)
def get_plan_details_v1_advisor_plan__plan_id__get(plan_id: str):
    try:
        # Example: Retrieve plan details based on the provided plan_id
        # Fetch plan details from the database or other data source
        plan_name = "Sample Plan"
        # You can populate other plan details as needed
        return GetAdvisorPlanResponse(
            id=plan_id,
            name=plan_name,
            partner=GetAdvisorPlanPartnerResponse(id="partner_id", name="Partner Name", external_id="ext_id"),
            data_partner=GetAdminDataPartnerResponse(id="data_partner_id", name="Data Partner", external_id="data_ext_id"),
            advisors=["advisor_id_1", "advisor_id_2"],
            external_id="ext_id"
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


if __name__ == '__main__':
    app.run(port=8000)


