import React, { useState } from 'react';
import * as api from '../api';

const GoalCalculator = () => {
    const [targetAmount, setTargetAmount] = useState('');
    const [monthlySaving, setMonthlySaving] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        setError('');
        setResult(null);
        try {
            const { data } = await api.calculateDuration({ targetAmount, monthlySaving });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Calculation failed.');
        }
    };

    return (
        <div className="mt-8 p-4 border-t">
            <h2 className="text-xl font-semibold mb-4">Goal Planner</h2>
            <p className="text-sm text-gray-600 mb-4">How long will it take to reach a goal?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Target Amount (e.g., 50000)"
                />
                <input
                    type="number"
                    value={monthlySaving}
                    onChange={(e) => setMonthlySaving(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="How much can you save monthly?"
                />
            </div>
            <button onClick={handleCalculate} className="mt-4 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Calculate Time
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {result && (
                <div className="mt-4 p-3 bg-green-100 rounded-md text-green-800">
                    <p>It will take you approximately **{result.months} months** (or {result.years} years) to reach your goal.</p>
                </div>
            )}
        </div>
    );
};
// Add this new function to api/index.js
// export const calculateDuration = (calcData) => API.post('/goals/calculate-duration', calcData);

export default GoalCalculator;