// client/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardPage = () => {
  // --- HACKATHON SIMULATION: Hardcode the user's ID ---
  const LOGGED_IN_USER_ID = "688ec891cbeb0216f10d0e65"; // Your correct ID is here.

  const [user, setUser] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // CORRECTED LOGIC: Check for the original placeholder string.
    if (
      !LOGGED_IN_USER_ID ||
      LOGGED_IN_USER_ID === "YOUR_USER_ID_HERE"
    ) {
      setError(
        "Please set the LOGGED_IN_USER_ID in the code to test this feature."
      );
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const usersRes = await axios.get(
          "http://localhost:5000/api/auth/users"
        );
        const currentUser = usersRes.data.find(
          (u) => u._id === LOGGED_IN_USER_ID
        );
        setUser(currentUser);

        const pickupsRes = await axios.get(
          `http://localhost:5000/api/pickups/my-pickups/${LOGGED_IN_USER_ID}`
        );
        setPickups(pickupsRes.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [LOGGED_IN_USER_ID]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      case "Assigned":
        return "bg-blue-200 text-blue-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading Dashboard...</div>;
  if (error)
    return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>

      {/* User Profile Section */}
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
            <p className="text-2xl font-bold text-green-600">
              <strong>Reward Points:</strong> {user.rewardPoints}
            </p>
          </div>
        </div>
      )}

      {/* Pickup History Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Pickup History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Address
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Quantity (kg)
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {pickups.length > 0 ? (
                pickups.map((pickup) => (
                  <tr key={pickup._id} className="border-b">
                    <td className="py-3 px-4">
                      {new Date(pickup.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{pickup.address}</td>
                    <td className="py-3 px-4">{pickup.wasteQuantity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`py-1 px-3 rounded-full text-xs ${getStatusBadge(
                          pickup.status
                        )}`}
                      >
                        {pickup.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    You have no pickup requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;