import axios from "axios";

// This sets the base URL for all requests
const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("userProfile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("userProfile")).token
    }`;
  }
  return req;
});

// AUTH
export const login = (formData) => API.post("/auth/login", formData);
export const signup = (formData) => API.post("/auth/register", formData);

// EXPENSES
export const addExpense = (expenseData) => API.post("/expenses", expenseData);
export const getExpenses = () => API.get("/expenses");

// GOALS
export const getGoals = () => API.get("/goals");
export const addGoal = (goalData) => API.post("/goals", goalData);
export const updateGoal = (id, goalData) => API.put(`/goals/${id}`, goalData);
export const calculateDuration = (calcData) =>
  API.post("/goals/calculate-duration", calcData);

// BUDGET PLANNER
export const createBudgetPlan = (planData) =>
  API.post("/budget/plan", planData);

// ADVICE
export const getAdvice = (data) => API.post("/advice", data);

// USER
export const getUserProfile = () => API.get("/user/me");
export const updateUserDetails = (details) => API.put("/user/details", details);
export const getInflationHistory = () => API.get("/user/inflation-history");

// AI CHATBOT
// This path has been corrected to remove the extra '/api/'
export const askChatbot = (chatData) => API.post('/api/simplebot/ask', chatData);;