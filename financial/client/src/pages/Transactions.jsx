import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Card from '../components/ui/Card';

const Transactions = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await api.getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.note}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-600">₹{expense.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Transactions;