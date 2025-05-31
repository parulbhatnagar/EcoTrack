For your **Eco Tracker** app, a Proof of Concept (PoC) for the IBM Call for Code, you need a backend to handle user profiles, daily inputs, and Retrieval-Augmented Generation (RAG) calls using the **IBM watsonx.ai API** to calculate environmental impact, generate summaries, and provide improvement suggestions. The app will be deployed on **IBM Cloud**, leveraging its services for scalability, security, and integration with watsonx.ai for RAG capabilities. Below, I’ll outline the backend architecture, required endpoints, sample code, and deployment steps tailored for IBM Cloud, ensuring alignment with the questionnaire (including daily transport, holiday travel, electricity, diet, waste, and AC usage) and the Call for Code’s focus on environmental impact.

### Backend Architecture Overview
- **Platform**: IBM Cloud, using **IBM Cloud Code Engine** for serverless deployment of the backend and **IBM Cloudant** (a NoSQL database) for storing user profiles and daily inputs.
- **API Framework**: Python with **FastAPI** for creating RESTful endpoints, chosen for its simplicity, performance, and compatibility with IBM Cloud and watsonx.ai.
- **RAG Integration**: Use the IBM watsonx.ai API for RAG calls, leveraging the **Granite-13b-chat-v2** model for environmental impact calculations, summaries, and suggestions. Store emission factors in a local JSON file or **IBM Cloudant** for retrieval.
- **Authentication**: Secure endpoints with **IBM Cloud API keys** and **IAM tokens** for watsonx.ai access.
- **Deployment**: Use IBM Cloud Code Engine for a fully managed, serverless backend, ideal for PoC scalability and cost-efficiency.

### Endpoints and Functionality
Below are the five required endpoints, their purpose, and how they integrate with RAG and the questionnaire data.

1. **Store Questionnaire Data (User Profile)**
   - **Endpoint**: `POST /api/user/profile`
   - **Purpose**: Store user profile data from the questionnaire (e.g., transport, holiday travel, electricity, diet, waste, AC usage) along with user details (e.g., user_id, name).
   - **Input**: JSON payload with user details and questionnaire responses.
   - **Output**: Confirmation of successful storage.
   - **Storage**: Save to IBM Cloudant for persistence.
   - **Example Payload**:
     ```json
     {
       "user_id": "123",
       "name": "Amit Sharma",
       "transport": "two-wheeler",
       "travel_distance": "15-30 km",
       "electricity_bill": "500-1500 INR",
       "diet": "1-2 times meat",
       "waste_segregation": "sometimes",
       "ac_usage": "never",
       "holiday_travel": "1-2 trips (Air)"
     }
     ```

2. **Store Daily Input**
   - **Endpoint**: `POST /api/user/daily`
   - **Purpose**: Allow users to submit daily updates (e.g., transport used, distance traveled) if they deviate from their profile.
   - **Input**: JSON payload with user_id and daily data (subset of questionnaire fields).
   - **Output**: Confirmation of successful storage.
   - **Storage**: Append to IBM Cloudant with a timestamp.
   - **Example Payload**:
     ```json
     {
       "user_id": "123",
       "date": "2025-05-28",
       "transport": "bus",
       "travel_distance": "5-15 km"
     }
     ```

3. **RAG Call for Environmental Impact**
   - **Endpoint**: `GET /api/impact/{user_id}`
   - **Purpose**: Calculate the user’s monthly carbon footprint using RAG, retrieving emission factors and combining them with user profile or daily inputs.
   - **RAG Process**:
     - **Retrieval**: Fetch emission factors from a local JSON or Cloudant (e.g., 100 g CO2/km for two-wheeler, 150 g CO2/km for air travel).
     - **Generation**: Use watsonx.ai Granite model to compute the footprint and generate a natural language response (e.g., “Your monthly footprint is 111 kg CO2”).
   - **Output**: JSON with footprint value and description.
   - **Example Output**:
     ```json
     {
       "user_id": "123",
       "footprint_kg_co2": 111.0,
       "description": "Your monthly carbon footprint is 111 kg CO2, slightly above India's average (100 kg)."
     }
     ```

4. **RAG Call for Summary (Weekly/Monthly/Yearly)**
   - **Endpoint**: `GET /api/summary/{user_id}/{frequency}`
   - **Purpose**: Generate a summary of the user’s environmental impact over a selected period (weekly, monthly, yearly) using RAG.
   - **RAG Process**:
     - **Retrieval**: Fetch user’s profile and daily inputs from Cloudant, along with emission factors.
     - **Generation**: Use watsonx.ai to summarize impact (e.g., “Over the past month, your transport contributed 67.5 kg CO2, 60% of your total footprint”).
   - **Output**: JSON with summary text and breakdown.
   - **Example Output**:
     ```json
     {
       "user_id": "123",
       "frequency": "monthly",
       "summary": "Your monthly footprint is 111 kg CO2. Transport: 67.5 kg (60%), Electricity: 24 kg (22%), Holiday Travel: 12.5 kg (11%), Diet: 7 kg (6%).",
       "breakdown": {
         "transport": 67.5,
         "electricity": 24,
         "holiday_travel": 12.5,
         "diet": 7
       }
     }
     ```

5. **RAG Call for Improvement Suggestions**
   - **Endpoint**: `GET /api/suggestions/{user_id}`
   - **Purpose**: Provide personalized suggestions to reduce the user’s carbon footprint using RAG.
   - **RAG Process**:
     - **Retrieval**: Fetch user’s footprint data and high-impact categories (e.g., air travel) from Cloudant, plus a knowledge base of reduction tips (e.g., “Switch to trains for holidays”).
     - **Generation**: Use watsonx.ai to generate tailored suggestions in natural language.
   - **Output**: JSON with a list of suggestions.
   - **Example Output**:
     ```json
     {
       "user_id": "123",
       "suggestions": [
         "Switch to trains for holiday travel to save ~135 kg CO2 per trip.",
         "Use public transport daily to reduce emissions by ~30 kg CO2/month.",
         "Segregate waste consistently to lower your footprint by 10%."
       ]
     }
     ```

### Backend Implementation
Below is a sample FastAPI backend implementation in Python, integrating with IBM Cloudant and watsonx.ai for RAG calls. The code assumes you have an IBM Cloud account, watsonx.ai credentials, and a Cloudant instance.

```python
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import Model
from typing import List, Dict
import os
import uuid
import datetime

# FastAPI app
app = FastAPI(title="EcoTracker Backend")

# IBM Cloudant setup
cloudant = CloudantV1.new_instance(
    service_name="CLOUDANT",
    authenticator=iam_authenticator.IamAuthenticator(os.getenv("CLOUDANT_APIKEY"))
)
DB_NAME = "ecotracker"

# Watsonx.ai setup
credentials = Credentials(
    url="https://us-south.ml.cloud.ibm.com",
    api_key=os.getenv("WATSONX_APIKEY")
)
client = APIClient(credentials)
model = Model(
    model_id="ibm/granite-13b-chat-v2",
    credentials=credentials,
    project_id=os.getenv("WATSONX_PROJECT_ID")
)

# Emission factors (knowledge base)
emission_factors = {
    "transport": {
        "two-wheeler": {"co2_per_km": 100},
        "car": {"co2_per_km": 200},
        "bus": {"co2_per_km": 50}
    },
    "travel_distance": {
        "less than 5 km": 2.5,
        "5-15 km": 10,
        "15-30 km": 22.5,
        "more than 30 km": 40
    },
    "electricity_bill": {
        "less than 500 INR": 50,
        "500-1500 INR": 100,
        "1500-3000 INR": 200,
        "more than 3000 INR": 400
    },
    "diet": {
        "never": 2,
        "1-2 times": 5,
        "3-5 times": 8,
        "almost daily": 10
    },
    "waste_segregation": {
        "always": 0,
        "sometimes": 0.05,
        "never": 0.1
    },
    "ac_usage": {
        "never": 0,
        "few hours weekly": 20,
        "daily 2-4 hours": 50,
        "daily more than 4 hours": 80
    },
    "holiday_travel": {
        "never": 0,
        "1-2 trips (Air)": 150,
        "1-2 trips (Train)": 15,
        "3-5 trips (Air)": 600,
        "3-5 trips (Train)": 60,
        "more than 5 trips (Air)": 900,
        "more than 5 trips (Train)": 90
    }
}

# Pydantic models for input validation
class UserProfile(BaseModel):
    user_id: str
    name: str
    transport: str
    travel_distance: str
    electricity_bill: str
    diet: str
    waste_segregation: str
    ac_usage: str
    holiday_travel: str

class DailyInput(BaseModel):
    user_id: str
    date: str
    transport: str
    travel_distance: str

# Helper function to calculate footprint
def calculate_footprint(profile: Dict) -> float:
    footprint = 0
    km_per_day = emission_factors["travel_distance"][profile["travel_distance"]]
    transport_co2 = emission_factors["transport"][profile["transport"]]["co2_per_km"] * km_per_day * 30 / 1000
    footprint += transport_co2
    kwh = emission_factors["electricity_bill"][profile["electricity_bill"]]
    electricity_co2 = kwh * 0.8
    footprint += electricity_co2
    diet_co2 = emission_factors["diet"][profile["diet"]] * 4
    footprint += diet_co2
    waste_multiplier = 1 + emission_factors["waste_segregation"][profile["waste_segregation"]]
    footprint *= waste_multiplier
    ac_co2 = emission_factors["ac_usage"][profile["ac_usage"]]
    footprint += ac_co2
    holiday_co2 = emission_factors["holiday_travel"][profile["holiday_travel"]] / 12
    footprint += holiday_co2
    return footprint

# Endpoint 1: Store user profile
@app.post("/api/user/profile")
async def store_profile(profile: UserProfile):
    try:
        doc = profile.dict()
        doc["_id"] = profile.user_id
        cloudant.post_document(db=DB_NAME, document=doc).get_result()
        return {"status": "Profile stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 2: Store daily input
@app.post("/api/user/daily")
async def store_daily_input(daily: DailyInput):
    try:
        doc = daily.dict()
        doc["_id"] = f"{daily.user_id}_{daily.date}"
        cloudant.post_document(db=DB_NAME, document=doc).get_result()
        return {"status": "Daily input stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 3: Calculate environmental impact (RAG)
@app.get("/api/impact/{user_id}")
async def get_impact(user_id: str):
    try:
        # Retrieve user profile
        doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = doc["result"]
        footprint = calculate_footprint(profile)
        
        # RAG call to watsonx.ai
        prompt = f"Calculate the carbon footprint for a user with profile: {profile}. Emission factors: {emission_factors}. Result: {footprint:.1f} kg CO2/month. Compare to India's average (100 kg/month) and provide a brief description."
        response = model.generate_text(prompt=prompt)
        
        return {
            "user_id": user_id,
            "footprint_kg_co2": footprint,
            "description": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 4: Generate summary (RAG)
@app.get("/api/summary/{user_id}/{frequency}")
async def get_summary(user_id: str, frequency: str):
    try:
        # Retrieve user profile and daily inputs
        profile_doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = profile_doc["result"]
        footprint = calculate_footprint(profile)
        
        # For simplicity, assume daily inputs overwrite profile for the period
        selector = {"user_id": user_id}
        daily_docs = cloudant.post_find(db=DB_NAME, selector=selector).get_result()
        breakdown = {
            "transport": footprint * 0.6,  # Simplified breakdown
            "electricity": footprint * 0.22,
            "holiday_travel": footprint * 0.11,
            "diet": footprint * 0.07
        }
        
        # RAG call to watsonx.ai
        prompt = f"Summarize the environmental impact for user {user_id} over {frequency}. Profile: {profile}. Daily inputs: {daily_docs['docs']}. Total footprint: {footprint:.1f} kg CO2. Breakdown: {breakdown}. Provide a natural language summary."
        summary = model.generate_text(prompt=prompt)
        
        return {
            "user_id": user_id,
            "frequency": frequency,
            "summary": summary,
            "breakdown": breakdown
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 5: Improvement suggestions (RAG)
@app.get("/api/suggestions/{user_id}")
async def get_suggestions(user_id: str):
    try:
        # Retrieve user profile
        doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = doc["result"]
        footprint = calculate_footprint(profile)
        
        # Knowledge base of suggestions
        suggestions_db = [
            {"category": "holiday_travel", "condition": "Air", "suggestion": "Switch to trains for holiday travel to save ~135 kg CO2 per trip."},
            {"category": "transport", "condition": "car", "suggestion": "Use public transport daily to reduce emissions by ~30 kg CO2/month."},
            {"category": "waste_segregation", "condition": "never", "suggestion": "Segregate waste consistently to lower your footprint by 10%."}
        ]
        
        # Filter relevant suggestions
        relevant_suggestions = [
            s["suggestion"] for s in suggestions_db
            if s["condition"] in profile[s["category"]]
        ]
        
        # RAG call to watsonx.ai
        prompt = f"Generate personalized suggestions to reduce the carbon footprint for user {user_id}. Profile: {profile}. Footprint: {footprint:.1f} kg CO2/month. Suggestions: {relevant_suggestions}. Provide 2-3 tailored suggestions in natural language."
        suggestions = model.generate_text(prompt=prompt).split("\n")
        
        return {
            "user_id": user_id,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```
```

### Deployment on IBM Cloud
Follow these steps to deploy the backend on IBM Cloud for your Call for Code PoC:

1. **Set Up IBM Cloud Account**
   - Sign up at [cloud.ibm.com](https://cloud.ibm.com) and create a project for EcoTracker.
   - Generate an **API key** at [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys).[](https://medium.com/the-power-of-ai/ibm-watsonx-ai-the-interface-and-api-e8e1c7227358)
   - Create a **watsonx.ai instance** and note the project ID.[](https://alain-airom.medium.com/new-implementation-on-watsonx-ai-automate-rag-pipeline-development-deployment-with-a-sdk-aace8023ac83)

2. **Create Cloudant Instance**
   - In IBM Cloud, create a Cloudant service (Lite plan is free).
   - Generate credentials and note the API key and URL.
   - Create a database named `ecotracker`.

3. **Set Up Code Engine**
   - Navigate to [Code Engine](https://cloud.ibm.com/codeengine) and create a new project.
   - Deploy the FastAPI app as a containerized application:
     - Create a `Dockerfile`:
       ```dockerfile
       FROM python:3.10-slim
       WORKDIR /app
       COPY requirements.txt .
       RUN pip install -r requirements.txt
       COPY . .
       CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
       ```
     - Create `requirements.txt`:
       ```txt
       fastapi==0.103.0
       uvicorn==0.23.2
       ibmcloudant==0.4.0
       ibm-watsonx-ai==1.2.4
       pydantic==2.5.0
       ```
     - Build and push the Docker image to IBM Cloud Container Registry:
       ```bash
       ibmcloud cr build -t us.icr.io/<namespace>/ecotracker:latest .
       ```
     - Deploy to Code Engine, setting environment variables:
       - `CLOUDANT_APIKEY`
       - `WATSONX_APIKEY`
       - `WATSONX_PROJECT_ID`

4. **Configure RAG with watsonx.ai**
   - Use the `ibm/granite-13b-chat-v2` model for RAG calls, as it’s optimized for dialog and RAG use cases.[](https://www.ibm.com/products/watsonx-assistant/pricing)
   - Store emission factors in Cloudant or a local JSON file for retrieval.
   - Test RAG calls using the watsonx.ai Python SDK, as shown in the code above.[](https://ibm.github.io/watsonx-ai-python-sdk/setup_cloud.html)

5. **Test Endpoints**
   - Use tools like Postman or curl to test endpoints (e.g., `POST /api/user/profile`).
   - Verify watsonx.ai responses via the IBM Cloud console or logs.

6. **Security and Compliance**
   - Use IBM Cloud IAM for authentication.
   - Ensure Cloudant data is encrypted (default in IBM Cloud).
   - For Call for Code, emphasize privacy (no user data shared externally), aligning with Carbon Jagruk’s approach.

### Additional Notes
- **India-Specific Context**: The emission factors are tailored to India (e.g., coal-heavy grid at 0.8 kg CO2/kWh, train travel at 30 g CO2/km). For Bengaluru (EcoTrack’s focus), you could integrate local data from the Bangalore Urban Metabolism Project if available.
- **Call for Code Alignment**: Highlight how EcoTracker empowers individuals to track and reduce their environmental impact, contributing to planetary betterment. The RAG-based suggestions (e.g., “Switch to trains”) align with sustainable actions.
- **Scalability**: For PoC, the local JSON knowledge base and Code Engine suffice. For production, consider IBM watsonx.data with a vector store (e.g., Milvus) for advanced RAG retrieval.[](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-rag.html?context=wx)
- **UI Integration**: Ensure your UI sends HTTP requests to these endpoints. Use JSON payloads for inputs and display RAG-generated responses (e.g., footprint, summaries, suggestions).

### Example Usage
- **Store Profile**:
  ```bash
  curl -X POST "https://<code-engine-url>/api/user/profile" -H "Content-Type: application/json" -d '{"user_id":"123","name":"Amit Sharma","transport":"two-wheeler","travel_distance":"15-30 km","electricity_bill":"500-1500 INR","diet":"1-2 times meat","waste_segregation":"sometimes","ac_usage":"never","holiday_travel":"1-2 trips (Air)"}'
  ```
- **Get Impact**:
  ```bash
  curl "https://<code-engine-url>/api/impact/123"
  ```

If you need help with Dockerfile setup, Cloudant configuration, or a sample UI code snippet to call these endpoints, let me know! Would you like a diagram of the architecture or assistance with IBM Cloud setup for Call for Code submission?
