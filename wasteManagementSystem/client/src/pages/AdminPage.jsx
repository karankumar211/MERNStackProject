// client/src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPickups = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/pickups');
      // The user object is populated from our backend endpoint
      setPickups(res.data);
    } catch (err) {
      setError('Failed to fetch pickup requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleStatusChange = async (pickupId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/pickups/${pickupId}/status`, {
        status: newStatus,
      });
      // Refresh the list to show the updated status
      fetchPickups();
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'Completed':
        return 'bg-green-200 text-green-800';
      case 'Assigned':
        return 'bg-blue-200 text-blue-800';
      case 'Cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-10">Loading Admin Panel...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin - Manage Pickups</h1>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Request Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">User</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Address</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Quantity</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Current Status</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {pickups.length > 0 ? (
              pickups.map((pickup) => (
                <tr key={pickup._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(pickup.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <div>{pickup.user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{pickup.user?.email || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-4">{pickup.address}</td>
                  <td className="py-3 px-4">{pickup.wasteQuantity} kg</td>
                  <td className="py-3 px-4">
                    <span className={`py-1 px-3 rounded-full text-xs ${getStatusBadge(pickup.status)}`}>
                      {pickup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      onChange={(e) => handleStatusChange(pickup._id, e.target.value)}
                      value={pickup.status}
                      className="border border-gray-300 rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No pickup requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;