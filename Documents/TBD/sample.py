import requests
from ibm_watson import DiscoveryV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json
import os

# Watson Discovery setup
authenticator = IAMAuthenticator('YOUR_DISCOVERY_API_KEY')
discovery = DiscoveryV2(
    version='2023-03-31',
    authenticator=authenticator
)
discovery.set_service_url('YOUR_DISCOVERY_SERVICE_URL')

# Watsonx.ai API endpoint and credentials
WATSONX_API_URL = 'YOUR_WATSONX_API_URL'
WATSONX_API_KEY = 'YOUR_WATSONX_API_KEY'

# Step 1: Ingest the PDF into Watson Discovery
def ingest_pdf():
    project_id = 'YOUR_PROJECT_ID'
    collection_id = 'YOUR_COLLECTION_ID'
    pdf_path = './environmental_data.pdf'  # Path to your static PDF

    try:
        with open(pdf_path, 'rb') as pdf_file:
            response = discovery.add_document(
                project_id=project_id,
                collection_id=collection_id,
                file=pdf_file,
                filename='environmental_data.pdf',
                file_content_type='application/pdf'
            ).get_result()
        print('PDF ingested successfully into Watson Discovery:', response)
    except Exception as e:
        print('Error ingesting PDF:', str(e))

# Step 2: RAG Call 1 - Calculate Impact Score
def calculate_impact_score(user_activities, region):
    project_id = 'YOUR_PROJECT_ID'
    collection_id = 'YOUR_COLLECTION_ID'

    # Query Watson Discovery for relevant environmental data
    query = f"impact:transport={user_activities['transport']},food={user_activities['food']},water={user_activities['water']};region:{region}"
    response = discovery.query(
        project_id=project_id,
        collection_id=collection_id,
        query=query,
        return_fields=['emission_factors', 'water_usage', 'regional_factors']
    ).get_result()

    retrieved_data = response.get('results', [{}])[0].get('document_passages', [])
    context = json.dumps(retrieved_data)  # Retrieved data (e.g., emission factors)

    # Use watsonx.ai to generate Impact Score
    prompt = f"Calculate an environmental Impact Score (0-100) for a user with activities: {json.dumps(user_activities)} in {region}. Use the following data: {context}. Ensure scores are relative to regional context."
    headers = {
        'Authorization': f'Bearer {WATSONX_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'prompt': prompt,
        'model': 'granite',
        'max_tokens': 100
    }

    try:
        watsonx_response = requests.post(WATSONX_API_URL, headers=headers, json=payload)
        watsonx_response.raise_for_status()
        result = watsonx_response.json()
        return result.get('generated_text', 'Error calculating score')
    except Exception as e:
        print('Error in watsonx.ai call for Impact Score:', str(e))
        return 'Error calculating score'

# Step 3: RAG Call 2 - Summarize Weekly Scores
def summarize_weekly_scores(user_weekly_data):
    project_id = 'YOUR_PROJECT_ID'
    collection_id = 'YOUR_COLLECTION_ID'

    # Query Watson Discovery for user's weekly data and environmental factors
    query = f"user_data:{json.dumps(user_weekly_data['activities'])}"
    response = discovery.query(
        project_id=project_id,
        collection_id=collection_id,
        query=query,
        return_fields=['emission_factors', 'water_usage', 'waste_impact']
    ).get_result()

    retrieved_data = response.get('results', [{}])[0].get('document_passages', [])
    context = json.dumps(retrieved_data)

    # Use watsonx.ai to generate weekly summary
    prompt = f"Summarize the user's weekly environmental scores based on activities: {json.dumps(user_weekly_data['activities'])}. Identify factors causing score changes using this data: {context}."
    headers = {
        'Authorization': f'Bearer {WATSONX_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'prompt': prompt,
        'model': 'granite',
        'max_tokens': 150
    }

    try:
        watsonx_response = requests.post(WATSONX_API_URL, headers=headers, json=payload)
        watsonx_response.raise_for_status()
        result = watsonx_response.json()
        return result.get('generated_text', 'Error generating summary')
    except Exception as e:
        print('Error in watsonx.ai call for Weekly Summary:', str(e))
        return 'Error generating summary'

# Step 4: RAG Call 3 - Generate Recommendations
def generate_recommendations(user_activities, region):
    project_id = 'YOUR_PROJECT_ID'
    collection_id = 'YOUR_COLLECTION_ID'

    # Query Watson Discovery for sustainability solutions
    query = f"solutions:reduce_impact;activities:{json.dumps(user_activities)};region:{region}"
    response = discovery.query(
        project_id=project_id,
        collection_id=collection_id,
        query=query,
        return_fields=['sustainability_solutions', 'offset_programs', 'regional_reports']
    ).get_result()

    retrieved_data = response.get('results', [{}])[0].get('document_passages', [])
    context = json.dumps(retrieved_data)

    # Use watsonx.ai to generate recommendations
    prompt = f"Suggest actions to improve the user's environmental Impact Score based on activities: {json.dumps(user_activities)} in {region}. Use this data: {context}."
    headers = {
        'Authorization': f'Bearer {WATSONX_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'prompt': prompt,
        'model': 'granite',
        'max_tokens': 150
    }

    try:
        watsonx_response = requests.post(WATSONX_API_URL, headers=headers, json=payload)
        watsonx_response.raise_for_status()
        result = watsonx_response.json()
        return result.get('generated_text', 'Error generating recommendations')
    except Exception as e:
        print('Error in watsonx.ai call for Recommendations:', str(e))
        return 'Error generating recommendations'

# Example Usage
def main():
    # Ingest the PDF (run once to upload the data)
    ingest_pdf()

    # Sample user data
    user_activities = {
        'transport': 'car-gasoline-21km',
        'food': 'beef-1-serving',
        'water': 'shower-6min'
    }
    region = 'urban'
    user_weekly_data = {
        'activities': [
            {'day': '2025-05-25', 'transport': 'car-gasoline-21km', 'food': 'beef-1-serving', 'water': 'shower-6min'},
            {'day': '2025-05-26', 'transport': 'walk-3km', 'food': 'vegetarian', 'water': 'shower-4min'}
        ]
    }

    # RAG Call 1: Calculate Impact Score
    impact_score = calculate_impact_score(user_activities, region)
    print('Impact Score:', impact_score)

    # RAG Call 2: Summarize Weekly Scores
    weekly_summary = summarize_weekly_scores(user_weekly_data)
    print('Weekly Summary:', weekly_summary)

    # RAG Call 3: Generate Recommendations
    recommendations = generate_recommendations(user_activities, region)
    print('Recommendations:', recommendations)

if __name__ == '__main__':
    main()
