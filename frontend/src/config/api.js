export const API_BASE_URL = "http://localhost:5002/api";
export const endpoint = {
  saveProfileData: `${API_BASE_URL}/profile`,
  saveDailyEcoData: `${API_BASE_URL}/dailyinput`,
  getDailySummary: `${API_BASE_URL}/impact/user_001`, // user_002 also has some data
};

export const dailySummaryData =
  "\n\nAssistant: Air: 50/100 (Moderate pollution due to vehicle emissions and industrial activities.), Water: 30/100 (Low contamination risk from domestic waste and limited industrial discharge.), Land: 40/100 (Moderate degradation due to urbanization and construction activities.). Overall Score: 42/100.";
