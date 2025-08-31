// client/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-400">
          Plastic+
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-green-300">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-green-300">
            Dashboard
          </Link>
          <Link to="/products" className="hover:text-green-300">
            Products
          </Link>{" "}
          <Link to="/admin" className="hover:text-green-300">Admin</Link> 
          {/* <-- ADD THIS */}
          <Link to="/request-pickup" className="hover:text-green-300">
            Request Pickup
          </Link>
          <Link to="/register" className="hover:text-green-300">
            Register
          </Link>
          <Link to="/login" className="hover:text-green-300">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
