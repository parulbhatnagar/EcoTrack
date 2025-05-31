import os
import csv
import json
from flask import Blueprint, request, jsonify, Response
import requests

dailyinput_bp = Blueprint('dailyinput', __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DAILY_CSV = os.path.join(BASE_DIR, 'daily_input_data.csv')
PROFILE_CSV = os.path.join(BASE_DIR, 'profile_data.csv')
SUMMARY_CSV = os.path.join(BASE_DIR, 'Summary.csv')  # New summary CSV file

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
    """Read CSV and return first matching row dict for user_id or None"""
    if not os.path.isfile(csv_path):
        return None
    with open(csv_path, newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row.get('user_id') == user_id:
                return row
    return None


def read_all_csv_for_user(csv_path, user_id):
    """Read CSV and return all matching rows as list of dicts for user_id"""
    if not os.path.isfile(csv_path):
        return None
    result = []
    with open(csv_path, newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row.get('user_id') == user_id:
                result.append(row)
    return result if result else None


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
        if not os.path.isfile(DAILY_CSV):
            if os.path.isfile(DAILY_INPUT_JSON):
                with open(DAILY_INPUT_JSON) as json_file:
                    sample_daily_data = json.load(json_file)
                    if isinstance(sample_daily_data, dict):
                        sample_daily_data = [sample_daily_data]
                    for entry in sample_daily_data:
                        save_json_to_csv(entry, DAILY_CSV)
                user_data = read_csv_for_user(DAILY_CSV, user_id)
        else:
            user_data = None

    if user_data is None:
        user_data = read_csv_for_user(PROFILE_CSV, user_id)

        if user_data is None and os.path.isfile(PROFILE_JSON):
            with open(PROFILE_JSON) as json_file:
                profile_data = json.load(json_file)
                if isinstance(profile_data, dict):
                    profile_data = [profile_data]
                for entry in profile_data:
                    save_json_to_csv(entry, PROFILE_CSV)
                user_data = read_csv_for_user(PROFILE_CSV, user_id)

    if not user_data:
        return jsonify({"error": "User data not found in daily input or profile."}), 404

    # --- RAG implementation stub for impact ---
    footprint = 111.0  # dummy placeholder, replace with real logic
    rag_status = "Amber"  # Default to Amber
    if footprint < 80:
        rag_status = "Green"
    elif footprint > 130:
        rag_status = "Red"

    response = {
        "user_id": user_id,
        "footprint_kg_co2": footprint,
        "rag_status": rag_status,  # RAG status added here
        "description": f"Your monthly carbon footprint is {footprint} kg CO2, slightly above India's average (100 kg)."
    }
    return jsonify(response), 200


@dailyinput_bp.route('/api/summary/<user_id>', methods=['GET'])
def get_summary(user_id):
    # Check if SUMMARY_CSV exists and has any rows (excluding header)
    summary_exists = os.path.isfile(SUMMARY_CSV)
    summary_has_rows = False
    if summary_exists:
        with open(SUMMARY_CSV, newline='') as f:
            reader = csv.DictReader(f)
            summary_rows = list(reader)
            summary_has_rows = len(summary_rows) > 0
            for row in summary_rows:
                if row.get('user_id') == user_id:
                    return jsonify({
                        "user_id": user_id,
                        "summary_score": float(row.get("summary_score", 78.5)),
                        "insight": row.get("insight", "You used public transport 4 times this week and saved 15 kg CO2!")
                    }), 200

    # Fallback to daily_input_data.csv
    user_entries = []
    if os.path.isfile(DAILY_CSV):
        with open(DAILY_CSV, newline='') as f:
            reader = csv.DictReader(f)
            user_entries = [row for row in reader if row.get('user_id') == user_id]

    # If not enough entries, simulate 7 days from daily_input_sample.json
    if len(user_entries) < 7:
        if not os.path.isfile(DAILY_INPUT_JSON):
            return jsonify({"error": "Sample input JSON not found."}), 404

        with open(DAILY_INPUT_JSON) as f:
            sample_data = json.load(f)

        if isinstance(sample_data, dict):
            sample_data = [sample_data]

        from copy import deepcopy
        import random

        generated_entries = []
        for i in range(7):
            entry = deepcopy(sample_data[0])
            entry['user_id'] = user_id
            entry['day'] = f"day_{i+1}"
            entry['transport_mode'] = random.choice(['bus', 'car', 'bike', 'metro', 'walk'])
            save_json_to_csv(entry, DAILY_CSV)
            generated_entries.append(entry)

        user_entries = generated_entries

    # Compute summary (basic logic)
    public_modes = {'bus', 'metro'}
    public_count = sum(1 for e in user_entries if e.get('transport_mode') in public_modes)
    co2_saved = public_count * 3.75

    summary_result = {
        "user_id": user_id,
        "summary_score": 78.5,
        "insight": f"You used public transport {public_count} times this week and saved {round(co2_saved, 1)} kg CO2!"
    }

    save_json_to_csv(summary_result, SUMMARY_CSV)
    return jsonify(summary_result), 200
