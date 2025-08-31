// client/src/pages/PickupPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

const PickupPage = () => {
  // --- HACKATHON SIMULATION: Hardcode the user's ID ---
  // In a real app, this would come from your authentication context/state.
  const LOGGED_IN_USER_ID = '688ec891cbeb0216f10d0e65'; // <-- PASTE YOUR USER'S _id HERE

  const [formData, setFormData] = useState({
    address: '',
    wasteQuantity: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { address, wasteQuantity } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!address || !wasteQuantity) {
      setError('Please fill out all fields.');
      return;
    }
    if (!LOGGED_IN_USER_ID || LOGGED_IN_USER_ID === '688ec891cbeb0216f10d0e65') {
      setError('Please set the LOGGED_IN_USER_ID in the code to test this feature.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const pickupData = {
        userId: LOGGED_IN_USER_ID,
        address,
        wasteQuantity: Number(wasteQuantity),
      };

      await axios.post('http://localhost:5000/api/pickups', pickupData);
      
      setSuccess('Pickup request submitted successfully! Our agent will be in touch.');
      setFormData({ address: '', wasteQuantity: '' }); // Clear the form

    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800">Request a Waste Pickup</h2>
          <p className="text-center text-gray-600 mt-2">Fill out the details below to schedule a collection.</p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4" role="alert">{success}</div>}

          <form onSubmit={onSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Full Pickup Address
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                id="address"
                placeholder="123 Green Street, Eco City, Telangana, 110022"
                name="address"
                value={address}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wasteQuantity">
                Approximate Waste Quantity (in kg)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="wasteQuantity"
                type="number"
                placeholder="e.g., 5"
                name="wasteQuantity"
                value={wasteQuantity}
                onChange={onChange}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-blue-300"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Schedule Pickup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PickupPage;