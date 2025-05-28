from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import Model
from typing import List, Dict
import os

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

# Impact coefficients (India-specific)
impact_coefficients = {
    "transport": {
        "two-wheeler": {"air": {"co2": 100, "nox": 0.5, "pm25": 0.2}, "water": 0.01, "land": 0.001, "energy": 0.05},
        "car": {"air": {"co2": 200, "nox": 0.8, "pm25": 0.3}, "water": 0.02, "land": 0.002, "energy": 0.1},
        "bus": {"air": {"co2": 50, "nox": 0.3, "pm25": 0.1}, "water": 0.005, "land": 0.001, "energy": 0.03}
    },
    "travel_distance": {
        "less than 5 km": 2.5,
        "5-15 km": 10,
        "15-30 km": 22.5,
        "more than 30 km": 40
    },
    "electricity_bill": {
        "less than 500 INR": {"kwh": 50, "air": {"co2": 40, "so2": 0.025}, "water": 100, "land": 5, "energy": 180},
        "500-1500 INR": {"kwh": 100, "air": {"co2": 80, "so2": 0.05}, "water": 200, "land": 10, "energy": 360},
        "1500-3000 INR": {"kwh": 200, "air": {"co2": 160, "so2": 0.1}, "water": 400, "land": 20, "energy": 720},
        "more than 3000 INR": {"kwh": 400, "air": {"co2": 320, "so2": 0.2}, "water": 800, "land": 40, "energy": 1440}
    },
    "diet": {
        "never": {"air": {"co2": 2}, "water": 50, "land": 0.02, "energy": 2},
        "1-2 times": {"air": {"co2": 5}, "water": 100, "land": 0.05, "energy": 5},
        "3-5 times": {"air": {"co2": 8}, "water": 200, "land": 0.08, "energy": 8},
        "almost daily": {"air": {"co2": 10}, "water": 300, "land": 0.1, "energy": 10}
    },
    "waste_segregation": {
        "always": {"air": {"co2": 0}, "water": 0, "land": 0, "energy": 0},
        "sometimes": {"air": {"co2": 0.25}, "water": 0.05, "land": 0.5, "energy": 0.05},
        "never": {"air": {"co2": 0.5}, "water": 0.1, "land": 1, "energy": 0.1}
    },
    "ac_usage": {
        "never": {"air": {"co2": 0, "hfc": 0}, "water": 0, "land": 0, "energy": 0},
        "few hours weekly": {"air": {"co2": 16, "hfc": 0.01}, "water": 40, "land": 0.1, "energy": 72},
        "daily 2-4 hours": {"air": {"co2": 40, "hfc": 0.025}, "water": 100, "land": 0.25, "energy": 180},
        "daily more than 4 hours": {"air": {"co2": 64, "hfc": 0.04}, "water": 160, "land": 0.4, "energy": 288}
    },
    "holiday_travel": {
        "never": {"air": {"co2": 0, "nox": 0}, "water": 0, "land": 0, "energy": 0},
        "1-2 trips (Air)": {"air": {"co2": 150, "nox": 1}, "water": 0.1, "land": 0.01, "energy": 500},
        "1-2 trips (Train)": {"air": {"co2": 15, "nox": 0.1}, "water": 0.05, "land": 0.005, "energy": 50},
        "3-5 trips (Air)": {"air": {"co2": 600, "nox": 4}, "water": 0.4, "land": 0.04, "energy": 2000},
        "3-5 trips (Train)": {"air": {"co2": 60, "nox": 0.4}, "water": 0.2, "land": 0.02, "energy": 200},
        "more than 5 trips (Air)": {"air": {"co2": 900, "nox": 6}, "water": 0.6, "land": 0.06, "energy": 3000},
        "more than 5 trips (Train)": {"air": {"co2": 90, "nox": 0.6}, "water": 0.3, "land": 0.03, "energy": 300}
    }
}

# Pydantic models
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

# Helper function to calculate impacts
def calculate_impacts(profile: Dict) -> Dict:
    impacts = {
        "air": {"co2": 0, "nox": 0, "pm25": 0, "so2": 0, "hfc": 0},
        "water": 0,
        "land": 0,
        "energy": 0
    }
    # Transport
    km_per_day = impact_coefficients["travel_distance"][profile["travel_distance"]]
    transport = impact_coefficients["transport"][profile["transport"]]
    impacts["air"]["co2"] += transport["air"]["co2"] * km_per_day * 30 / 1000
    impacts["air"]["nox"] += transport["air"]["nox"] * km_per_day * 30 / 1000
    impacts["air"]["pm25"] += transport["air"]["pm25"] * km_per_day * 30 / 1000
    impacts["water"] += transport["water"] * km_per_day * 30
    impacts["land"] += transport["land"] * km_per_day * 30
    impacts["energy"] += transport["energy"] * km_per_day * 30
    # Electricity
    elec = impact_coefficients["electricity_bill"][profile["electricity_bill"]]
    impacts["air"]["co2"] += elec["air"]["co2"]
    impacts["air"]["so2"] += elec["air"]["so2"]
    impacts["water"] += elec["water"]
    impacts["land"] += elec["land"]
    impacts["energy"] += elec["energy"]
    # Diet
    diet = impact_coefficients["diet"][profile["diet"]]
    impacts["air"]["co2"] += diet["air"]["co2"] * 4
    impacts["water"] += diet["water"] * 4
    impacts["land"] += diet["land"] * 4
    impacts["energy"] += diet["energy"] * 4
    # Waste
    waste = impact_coefficients["waste_segregation"][profile["waste_segregation"]]
    impacts["air"]["co2"] += waste["air"]["co2"] * 4
    impacts["water"] += waste["water"] * 4
    impacts["land"] += waste["land"] * 4
    impacts["energy"] += waste["energy"] * 4
    # AC
    ac = impact_coefficients["ac_usage"][profile["ac_usage"]]
    impacts["air"]["co2"] += ac["air"]["co2"]
    impacts["air"]["hfc"] += ac["air"]["hfc"]
    impacts["water"] += ac["water"]
    impacts["land"] += ac["land"]
    impacts["energy"] += ac["energy"]
    # Holiday Travel
    travel = impact_coefficients["holiday_travel"][profile["holiday_travel"]]
    impacts["air"]["co2"] += travel["air"]["co2"] / 12
    impacts["air"]["nox"] += travel["air"]["nox"] / 12
    impacts["water"] += travel["water"] / 12
    impacts["land"] += travel["land"] / 12
    impacts["energy"] += travel["energy"] / 12
    return impacts

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
        doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = doc["result"]
        impacts = calculate_impacts(profile)
        
        prompt = f"Calculate environmental impacts for user with profile: {profile}. Impacts: Air (CO2: {impacts['air']['co2']:.1f} kg, NOx: {impacts['air']['nox']:.2f} g, PM2.5: {impacts['air']['pm25']:.2f} g, SO2: {impacts['air']['so2']:.2f} g, HFC: {impacts['air']['hfc']:.2f} g), Water: {impacts['water']:.1f} L, Land: {impacts['land']:.2f} kg, Energy: {impacts['energy']:.1f} MJ. Compare to India's averages (CO2: 100 kg/month, Water: 500 L/month, Land: 10 kg/month) and provide a description."
        response = model.generate_text(prompt=prompt)
        
        return {
            "user_id": user_id,
            "impacts": impacts,
            "description": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 4: Generate summary (RAG)
@app.get("/api/summary/{user_id}/{frequency}")
async def get_summary(user_id: str, frequency: str):
    try:
        profile_doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = profile_doc["result"]
        impacts = calculate_impacts(profile)
        
        selector = {"user_id": user_id}
        daily_docs = cloudant.post_find(db=DB_NAME, selector=selector).get_result()
        
        # Adjust for frequency
        multiplier = {"weekly": 0.25, "monthly": 1, "yearly": 12}
        scaled_impacts = {
            "air": {k: v * multiplier[frequency] for k, v in impacts["air"].items()},
            "water": impacts["water"] * multiplier[frequency],
            "land": impacts["land"] * multiplier[frequency],
            "energy": impacts["energy"] * multiplier[frequency]
        }
        
        prompt = f"Summarize environmental impacts for user {user_id} over {frequency}. Profile: {profile}. Daily inputs: {daily_docs['docs']}. Impacts: Air (CO2: {scaled_impacts['air']['co2']:.1f} kg, NOx: {scaled_impacts['air']['nox']:.2f} g, PM2.5: {scaled_impacts['air']['pm25']:.2f} g, SO2: {scaled_impacts['air']['so2']:.2f} g, HFC: {scaled_impacts['air']['hfc']:.2f} g), Water: {scaled_impacts['water']:.1f} L, Land: {scaled_impacts['land']:.2f} kg, Energy: {scaled_impacts['energy']:.1f} MJ. Provide a breakdown and summary."
        summary = model.generate_text(prompt=prompt)
        
        return {
            "user_id": user_id,
            "frequency": frequency,
            "summary": summary,
            "impacts": scaled_impacts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint 5: Improvement suggestions (RAG)
@app.get("/api/suggestions/{user_id}")
async def get_suggestions(user_id: str):
    try:
        doc = cloudant.get_document(db=DB_NAME, doc_id=user_id).get_result()
        profile = doc["result"]
        impacts = calculate_impacts(profile)
        
        suggestions_db = [
            {"category": "holiday_travel", "condition": "Air", "suggestion": "Switch to trains for holiday travel to save ~135 kg CO2 and 0.9 g NOx per trip."},
            {"category": "transport", "condition": "car", "suggestion": "Use public transport daily to reduce CO2 by ~30 kg/month and PM2.5 by ~0.15 g/km."},
            {"category": "waste_segregation", "condition": "never", "suggestion": "Segregate waste to reduce landfill waste by 1 kg/month and water pollution by 0.1 L/month."},
            {"category": "diet", "condition": "almost daily", "suggestion": "Reduce meat consumption to 1-2 times/week to save 200 L water/month and 3 kg CO2/month."}
        ]
        
        relevant_suggestions = [
            s["suggestion"] for s in suggestions_db
            if s["condition"] in profile[s["category"]]
        ]
        
        prompt = f"Generate suggestions to reduce environmental impacts for user {user_id}. Profile: {profile}. Impacts: Air (CO2: {impacts['air']['co2']:.1f} kg, NOx: {impacts['air']['nox']:.2f} g), Water: {impacts['water']:.1f} L, Land: {impacts['land']:.2f} kg. Suggestions: {relevant_suggestions}. Provide 3 tailored suggestions."
        suggestions = model.generate_text(prompt=prompt).split("\n")
        
        return {
            "user_id": user_id,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
