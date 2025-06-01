import os
import csv
import json
from flask import Blueprint, request, jsonify, Response
import requests
from models.dailyScoreChatModel import WatsonxEnvironmentalDailyScore
import ast
from collections import Counter, defaultdict
import statistics
from models.suggestionsRagModel import EnvironmentalSuggestionGenerator
from models.laymanScoreGivenContextRag import LaymanScoreForUser

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

    # print(str(user_data))
    query = create_query(user_data)

    generator = LaymanScoreForUser(query)
    generator.run_pipeline()
    response = generator.get_suggestion("What is the Impact Coefficients & 1 day layman score for a daily activity for the person? Stricty give response as given in prompt")
    
    print(response)
    return jsonify(response), 200


@dailyinput_bp.route('/api/summary/<user_id>', methods=['GET'])
def get_summary(user_id):
    # Check if SUMMARY_CSV exists and has any rows (excluding header)
    summary_exists = os.path.isfile(SUMMARY_CSV)
    summary_has_rows = False
    user_entries = []
    if summary_exists:
        with open(SUMMARY_CSV, newline='') as f:
            reader = csv.DictReader(f)
            summary_rows = list(reader)
            summary_has_rows = len(summary_rows) > 0
            for row in summary_rows:
                if row.get('user_id') == user_id:
                    user_entries.append(row)

    # Fallback to daily_input_data.csv
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

    # print(user_entries)
    # Get the average summaries of all the rows
    total_data=""
    for data in user_entries:
        query = create_query(data)
        total_data=total_data+" "+query

    generator = LaymanScoreForUser(total_data)
    generator.run_pipeline()
    response = generator.get_suggestion("What is the summary layman score and overall score for a week for air, water and land for the person given the data? Stricty give response as given in prompt")

    # save_json_to_csv(summary_result, SUMMARY_CSV)
    return jsonify(response), 200

@dailyinput_bp.route('/api/suggestions/<user_id>', methods=['GET'])
def get_suggestions(user_id):
    URLS_DICTIONARY = {
    "env_article": "https://timesofindia.indiatimes.com/city/bengaluru/asthma-cases-surge-thanks-to-poor-air-quality-late-diagnosis/articleshow/120905786.cms"
    }

    generator = EnvironmentalSuggestionGenerator(URLS_DICTIONARY)
    generator.run_pipeline()
    response = generator.get_suggestion("How is Bangalore air quality?")
    print(response)
    return jsonify(response), 200


# Build the summary sentence
def create_query(record):

    # Convert all stringified JSON-like fields to actual Python objects
    for key in record:
        if isinstance(record[key], str) and record[key].startswith(("{", "[")):
            record[key] = ast.literal_eval(record[key])

    transport = record['transportation']
    energy = record['energy_home']
    home_activities = record['special_activities']
    food = record['food_consumption']
    shopping = record['purchases']
    waste = record['waste']
    plastics = record['plastic']
    water = record['water']

    parts = []

    # Transport
    parts.append(
        f"On {record['date']}, user {record['user_id']} traveled {transport['distance_km']} km by {transport['primary_mode']} "
        f"with {transport['passengers']} passenger(s) in {transport['traffic']} traffic "
        f"{'using ride-sharing' if transport['ride_sharing'] else 'without ride-sharing'}"
        f"{', including trips for ' + ', '.join(transport['secondary_trips']) if transport.get('secondary_trips') else ''}"
        f"{', and used delivery services for ' + ', '.join(transport['delivery_services']) if transport.get('delivery_services') else ''}."
    )

    # Energy
    hw = energy['hot_water']
    elec = energy['electronics']
    parts.append(
        f"Home energy use included {energy['heating_cooling']} heating/cooling, {hw['shower_min']} min showers, "
        f"{hw['laundry_loads']} laundry load(s), and electronics usage of {elec['screen_time_hrs']} hrs screen time, "
        f"{elec['gaming_hrs']} hrs gaming, {elec['work_equipment_hrs']} hrs work. Lighting was {energy['lighting']}."
    )

    # Special activities
    parts.append(f"Special activities included: {', '.join(home_activities)}.")

    # Food
    meals = food['meals']
    meat = food['meat_servings']
    parts.append(
        f"Meals were {meals['breakfast']} (breakfast), {meals['lunch']} (lunch), {meals['dinner']} (dinner), and {meals['snacks']} (snacks). "
        f"Consumed {meat['chicken']} chicken serving(s), 0 pork, 0 beef, had {food['plant_based_meals']} plant-based meals, "
        f"60% local/organic food, and food waste was {food['food_waste']}."
    )

    # Shopping
    parts.append(
        f"Made {shopping['online_orders']} online order(s) (size: {shopping['package_size']}), shopped locally in-store, "
        f"impulse buys: {', '.join(shopping['impulse'])}, sustainable choices: {', '.join(shopping['sustainable_choices'])}."
    )

    # Waste
    parts.append(
        f"Waste generated: {waste['general']} of general waste, recycling was {waste['recycling']}, composting: {waste['composting']}, "
        f"special items: {', '.join(waste['special'])}."
    )

    # Plastics
    su = plastics['single_use']
    parts.append(
        f"Plastic use included {su['food_containers']} food container(s), avoided {plastics['avoided_plastics_count']} plastic items, "
        f"packaging waste was {plastics['packaging_waste']}."
    )

    # Water
    du = water['direct_usage']
    dw = du['dishwashing']
    cons = water['conservation']
    parts.append(
        f"Water usage: {du['shower_time_min']} min shower(s), {du['baths']} bath(s), {dw['handwash_min']} min handwashing, "
        f"{dw['dishwasher_loads']} dishwasher load(s), {du['laundry_loads']} laundry load(s) with {du['water_temp']} water, "
        f"{du['outdoor_use_min']} min outdoor use. Conservation: shorter showers - {cons['shorter_showers']}, full loads - {cons['full_loads_only']}, "
        f"leak fixes - {cons['leak_fixes']}."
    )

    return " ".join(parts)