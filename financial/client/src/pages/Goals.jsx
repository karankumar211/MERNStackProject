import React, { useState, useEffect } from "react";
import * as api from "../api";
import Card from "../components/ui/Card";
import { Edit, Save, X, PlusCircle } from "lucide-react";
import GoalCalculator from "../components/GoalCalculator";

// This component now displays the goal's risk profile as a tag
const GoalProgress = ({ goal, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);
  const progress = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );

  const getTagColor = (risk) => {
    if (risk === "High") return "bg-red-100 text-red-800";
    if (risk === "Low") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800"; // Medium risk
  };

  const handleSave = () => {
    onUpdate(goal._id, { currentAmount: Number(currentAmount) });
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-wrap gap-x-2">
          <span className="font-semibold">{goal.goalName}</span>
          {/* NEW: Displays the risk profile tag */}
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTagColor(
              goal.riskProfile
            )}`}>
            {goal.riskProfile} Risk
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            ₹{goal.currentAmount.toLocaleString()} / ₹
            {goal.targetAmount.toLocaleString()}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-400 hover:text-blue-600">
            {isEditing ? <X size={16} /> : <Edit size={16} />}
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}></div>
      </div>
      {isEditing && (
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="number"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-md"
            placeholder="Update current amount"
          />
          <button
            onClick={handleSave}
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            <Save size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    targetAmount: "",
    targetDate: "",
    currentAmount: 0,
    riskProfile: "Medium", // Set default risk profile
  });
  const [advice, setAdvice] = useState(null);

  const fetchGoals = async () => {
    try {
      const { data } = await api.getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleUpdateGoal = async (id, updatedData) => {
    try {
      await api.updateGoal(id, updatedData);
      fetchGoals();
    } catch (error) {
      console.error("Failed to update goal", error);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const { data: createdGoal } = await api.addGoal(newGoal);
      setNewGoal({
        goalName: "",
        targetAmount: "",
        targetDate: "",
        currentAmount: 0,
        riskProfile: "Medium",
      });
      setIsCreating(false);
      fetchGoals();

      const savedIncome = localStorage.getItem("monthlyIncome");
      if (savedIncome) {
        const { data } = await api.getAdvice({
          newGoal: createdGoal,
          salary: savedIncome,
        });
        setAdvice(data);
      }
      setTimeout(() => setAdvice(null), 10000);
    } catch (error) {
      console.error("Failed to create goal", error);
      alert("Failed to create goal. Please check all fields.");
    }
  };

  const handleNewGoalChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Financial Goals</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          <PlusCircle size={18} />
          <span>{isCreating ? "Cancel" : "Add New Goal"}</span>
        </button>
      </div>

      {/* UPDATED: This now renders the advice and the emotional tags */}
      {advice && (
        <div
          className="mb-6 p-4 bg-blue-100 text-blue-900 rounded-lg shadow-sm"
          role="alert">
          <p className="font-semibold">💡 FinVoice Assistant Says:</p>
          <p className="mt-1">{advice.advice}</p>
          {advice.tags && advice.tags.length > 0 && (
            <div className="mt-2 flex items-center flex-wrap gap-2">
              {advice.tags.map((tagInfo) => {
                const tagColor =
                  tagInfo.type === "success"
                    ? "bg-green-200 text-green-900"
                    : "bg-yellow-200 text-yellow-900";
                return (
                  <span
                    key={tagInfo.tag}
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagColor}`}>
                    {tagInfo.tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* The form is now complete with the risk profile selector */}
      {isCreating && (
        <form
          onSubmit={handleCreateGoal}
          className="p-4 mb-6 space-y-4 bg-gray-50 rounded-lg border">
          <input
            type="text"
            name="goalName"
            placeholder="Goal Name (e.g., New Phone)"
            value={newGoal.goalName}
            onChange={handleNewGoalChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="targetAmount"
            placeholder="Target Amount (e.g., 80000)"
            value={newGoal.targetAmount}
            onChange={handleNewGoalChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            name="currentAmount"
            placeholder="Amount Already Saved (optional)"
            value={newGoal.currentAmount}
            onChange={handleNewGoalChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <div>
            <label className="text-sm text-gray-500">Target Date</label>
            <input
              type="date"
              name="targetDate"
              value={newGoal.targetDate}
              onChange={handleNewGoalChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Risk Profile</label>
            <select
              name="riskProfile"
              value={newGoal.riskProfile}
              onChange={handleNewGoalChange}
              className="w-full px-3 py-2 border rounded-md bg-white">
              <option value="Medium">Medium Risk (Default)</option>
              <option value="Low">Low Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
            Save Goal
          </button>
        </form>
      )}

      <div className="space-y-6">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalProgress
              key={goal._id}
              goal={goal}
              onUpdate={handleUpdateGoal}
            />
          ))
        ) : (
          <p>You haven't set any goals yet. Click "Add New Goal" to start!</p>
        )}
      </div>

      <GoalCalculator />
    </Card>
  );
};

export default Goals;
