import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import * as api from "../api";
import LineChart from "../components/charts/LineChart";

const Settings = () => {
  const [formData, setFormData] = useState({ income: "", inflationRate: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [inflationHistory, setInflationHistory] = useState([]);

  useEffect(() => {
    const fetchAllSettingsData = async () => {
      try {
        const [detailsRes, historyRes] = await Promise.all([
          api.getUserProfile(),
          api.getInflationHistory(),
        ]);
        setFormData({
          income: detailsRes.data.income || "",
          inflationRate: detailsRes.data.inflationRate || "",
        });
        setInflationHistory(historyRes.data);
      } catch (error) {
        console.error("Failed to fetch settings data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSettingsData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.updateUserDetails(formData);
      localStorage.setItem("monthlyIncome", formData.income);
      setMessage("Details saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to save details.");
    }
  };

  const chartData = {
    labels: inflationHistory.map((data) => data.year),
    datasets: [
      {
        label: "Annual Inflation Rate (India)",
        data: inflationHistory.map((data) => data.rate),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.5)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-600 mb-6">
          Manage your financial details here. This information will help the
          assistant provide more accurate advice.
        </p>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="income"
              className="block text-sm font-medium text-gray-700">
              Your Monthly Income (after tax)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                name="income"
                id="income"
                value={formData.income}
                onChange={handleChange}
                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300"
                placeholder="50000"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="inflationRate"
              className="block text-sm font-medium text-gray-700">
              Expected Annual Inflation Rate
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                name="inflationRate"
                id="inflationRate"
                value={formData.inflationRate}
                onChange={handleChange}
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300"
                placeholder="7.0"
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                %
              </span>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Save Details
          </button>
          {message && <p className="text-green-600 pt-2">{message}</p>}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">
          Historical Inflation Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Understanding past inflation helps you set a realistic expected rate
          for your goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="w-full h-80">
            <LineChart chartData={chartData} title="Inflation Rate Trend (%)" />
          </div>
          <div className="space-y-2">
            {inflationHistory.map((item) => (
              <div
                key={item.year}
                className="flex justify-between p-2 bg-gray-50 rounded-md">
                <span className="font-semibold">{item.year}</span>
                <span className="font-mono">{item.rate.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
