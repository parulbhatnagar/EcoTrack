export const API_BASE_URL = "http://localhost:5002/api/v1";
export const endpoint = {
  saveProfileData: `${API_BASE_URL}/saveProfileData`,
  saveDailyEcoData: `${API_BASE_URL}/saveDailyEcoData`,
  getDailySummary: `${API_BASE_URL}/getDailySummary`,
};


export const dailySummaryData = {
  "Air": {
    "Coefficient": 35,
    "Layman Score": "78/100",
    "Details": "10 km car ride in heavy traffic with 1 passenger equates to 6.25 kg CO2eq, above India's daily average of 3.33 kg. Additional home energy use contributes 2.94 kg CO2eq."
  },
  "Water": {
    "Coefficient": 50,
    "Layman Score": "55/100",
    "Details": "Water usage of 156.25 L, well above India's average of 166.67 L per day."
  },
  "Land": {
    "Coefficient": 40,
    "Layman Score": "60/100",
    "Details": "Land use of 10.89 kg, significantly above India's average of 0.167 kg."
  },
  "Overall Score": "65/100"
}