import React, { useState, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseVoiceInput } from "../utils/voiceParser";
import * as api from "../api";
import Card from "../components/ui/Card";
import FloatingMicButton from "../components/FloatingMicButton";
import AdviceBanner from "../components/AdviceBanner";
import DonutChart from "../components/charts/DonutChart";
import { DollarSign, TrendingUp, PiggyBank, AlertTriangle } from "lucide-react"; // Import AlertTriangle

const Dashboard = ({ language }) => {
  const [summary, setSummary] = useState({
    totalSpend: 0,
    savingRate: 0,
    goalProgress: 0,
  });
  const [chartData, setChartData] = useState(null);
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");
  // New state for the spending alert
  const [spendingAlert, setSpendingAlert] = useState('');

  const { isListening, transcript, startListening } = useSpeechRecognition({
    language,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: expenses } = await api.getExpenses();
      const totalSpend = expenses.reduce((sum, ex) => sum + ex.amount, 0);

      // --- NEW: Overspending Alert Logic ---
      const savedIncome = localStorage.getItem('monthlyIncome');
      if (savedIncome && totalSpend > (parseFloat(savedIncome) * 0.60)) {
        setSpendingAlert(`Warning: Your expenses of ₹${totalSpend.toLocaleString()} have exceeded 60% of your monthly income!`);
      } else {
        setSpendingAlert(''); // Clear the alert if spending is within limits
      }
      // ---------------------------------

      const totalsByCategory = expenses.reduce((acc, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
        return acc;
      }, {});

      setSummary({ totalSpend, savingRate: 25, goalProgress: 15 });
      setChartData({
        labels: Object.keys(totalsByCategory),
        datasets: [
          {
            label: "Expenses",
            data: Object.values(totalsByCategory),
            backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#8B5CF6"],
            hoverOffset: 4,
          },
        ],
      });
    } catch (err) {
      setError("Failed to fetch dashboard data.");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (transcript) {
      const parsed = parseVoiceInput(transcript);
      if (parsed && parsed.amount && parsed.note) {
        handleSaveExpense(parsed);
      } else {
        setError("Could not understand that. Please say something like 'add dinner rupees 300'.");
      }
    }
  }, [transcript]);

  const handleSaveExpense = async (expenseData) => {
    try {
      await api.addExpense({ ...expenseData, source: "voice" });
      alert(`Expense "${expenseData.note}" for ₹${expenseData.amount} saved!`);
      // Refresh data, which will re-trigger the overspending check
      fetchDashboardData();
    } catch (err) {
      setError("Failed to save expense.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* NEW: Display the spending alert when it's active */}
      {spendingAlert && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-md flex items-center space-x-4" role="alert">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <p className="font-bold">Overspending Alert</p>
            <p>{spendingAlert}</p>
          </div>
        </div>
      )}

      {advice && <AdviceBanner advice={advice} />}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <DollarSign className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-500">Total Spent (Month)</p>
              <p className="text-2xl font-bold">₹{summary.totalSpend.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-500">Saving Rate</p>
              <p className="text-2xl font-bold">{summary.savingRate}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <PiggyBank className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500">Goal Progress</p>
              <p className="text-2xl font-bold">{summary.goalProgress}%</p>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
        <div className="h-80">
          {chartData ? (
            <DonutChart chartData={chartData} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </Card>
      <FloatingMicButton isListening={isListening} onClick={startListening} />
    </div>
  );
};

export default Dashboard;