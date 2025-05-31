import os
import csv
import json
from flask import Blueprint, request, jsonify, Response

dailyinput_bp = Blueprint('dailyinput', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DAILY_CSV = os.path.join(BASE_DIR, 'daily_input_data.csv')
PROFILE_CSV = os.path.join(BASE_DIR, 'profile_data.csv')

# Explicit path to ProfileQuestion.json (one directory above)
PROFILE_JSON = os.path.join(os.path.dirname(BASE_DIR), 'ProfileQuestion.json')

# Explicit path to daily_input_sample.json (one directory above)
DAILY_INPUT_JSON = os.path.join(os.path.dirname(BASE_DIR), 'daily_input_sample.json')


def save_json_to_csv(data, csv_path):
    """Helper to save dict data to CSV"""
    file_exists = os.path.isfile(csv_path)
    with open(csv_path, mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=data.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)


def read_csv_for_user(csv_path, user_id):
    """Read CSV and return row dict for user_id or None"""
    if not os.path.isfile(csv_path):
        return None
    with open(csv_path, newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row.get('user_id') == user_id:
                return row
    return None


def csv_to_string(csv_path):
    """Read CSV content and return as string"""
    with open(csv_path, 'r') as f:
        return f.read()


@dailyinput_bp.route('/api/dailyinput', methods=['POST'])
def save_daily_input():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    save_json_to_csv(data, DAILY_CSV)

    csv_content = csv_to_string(DAILY_CSV)
    return Response(csv_content, mimetype='text/csv')


@dailyinput_bp.route('/api/profile', methods=['POST'])
def save_profile_input():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid input"}), 400

    save_json_to_csv(data, PROFILE_CSV)

    csv_content = csv_to_string(PROFILE_CSV)
    return Response(csv_content, mimetype='text/csv')


@dailyinput_bp.route('/api/impact/<user_id>', methods=['GET'])
def get_user_impact(user_id):
    user_data = read_csv_for_user(DAILY_CSV, user_id)

    # If daily CSV doesn't exist or user not found, try to create daily CSV first using sample JSON and then retry
    if user_data is None:
        # Check if daily CSV file is missing
        if not os.path.isfile(DAILY_CSV):
            # Load sample daily input JSON data to create the daily_input CSV
            if os.path.isfile(DAILY_INPUT_JSON):
                with open(DAILY_INPUT_JSON) as json_file:
                    sample_daily_data = json.load(json_file)
                    # sample_daily_data can be a dict or a list of dicts
                    # Normalize to list for saving multiple rows if needed
                    if isinstance(sample_daily_data, dict):
                        sample_daily_data = [sample_daily_data]

                    for entry in sample_daily_data:
                        save_json_to_csv(entry, DAILY_CSV)
                # After creating daily CSV, re-read user data
                user_data = read_csv_for_user(DAILY_CSV, user_id)
        else:
            # If file exists but user not found, don't do anything here
            user_data = None

    # If still not found, fallback to profile CSV
    if user_data is None:
        user_data = read_csv_for_user(PROFILE_CSV, user_id)

        # If profile CSV missing or user not found, generate from ProfileQuestion.json
        if user_data is None and os.path.isfile(PROFILE_JSON):
            with open(PROFILE_JSON) as json_file:
                profile_data = json.load(json_file)
                # Save profile JSON data to CSV
                # profile_data can be list or dict, normalize to list
                if isinstance(profile_data, dict):
                    profile_data = [profile_data]
                for entry in profile_data:
                    save_json_to_csv(entry, PROFILE_CSV)
                # Read user again after saving
                user_data = read_csv_for_user(PROFILE_CSV, user_id)

    if not user_data:
        return jsonify({"error": "User data not found in daily input or profile."}), 404

    # --- RAG implementation stub ---
    footprint = 111.0  # dummy placeholder, replace with real logic

    response = {
        "user_id": user_id,
        "footprint_kg_co2": footprint,
        "description": f"Your monthly carbon footprint is {footprint} kg CO2, slightly above India's average (100 kg)."
    }
    return jsonify(response), 200
