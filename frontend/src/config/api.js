export const API_BASE_URL = "http://localhost:5002/api";
export const endpoint = {
  saveProfileData: `${API_BASE_URL}/profile`,
  saveDailyEcoData: `${API_BASE_URL}/dailyinput`,
  getDailySummary: `${API_BASE_URL}/impact/user_001`, // user_002 also has some data
};

export const dailySummaryData =
  'Air: Summary Layman Score - 85/100 (High levels of particulate matter due to construction activities), Water: Summary Layman Score - 92/100 (Moderate pollution with some bacterial contamination), Land: Summary Layman Score - 78/100 (Minor deforestation observed). Overall Score: 84/100."';
