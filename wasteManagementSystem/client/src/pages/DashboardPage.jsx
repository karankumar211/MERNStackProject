import React, { useEffect, useState } from 'react';
import { getUser } from '../api/getUser';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUser(); 
      if (result) {
        setData(result);
      } else {
        setError("No user data found or session expired.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      
      {loading && <p>Loading user profile...</p>}
      
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      
      {data ? (
        <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
          <h3>Welcome, {data.name || "User"}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        !loading && <p>No profile data available.</p>
      )}

      <button 
        onClick={fetchUserData} 
        style={{ 
          marginTop: "20px",
          border: "2px solid black", 
          padding: "8px 16px", 
          cursor: "pointer",
          backgroundColor: "white" 
        }}
      >
        Refresh Profile
      </button>
    </div>
  );
};

export default DashboardPage;