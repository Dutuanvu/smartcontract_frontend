import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ onShowHistory }) {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#003366] text-white px-8 py-4 shadow-md flex justify-between items-center">
      {/* Logo with clickable redirect to Scan page */}
          <a href="#upload" className="flex items-center font-bold text-xl hover:opacity-90">
            <span className="text-yellow-400 mr-2 text-2xl">🛡️</span>
            <span className="text-white">SmartContractScanner</span>
          </a>

      {/* Navigation */}
      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6">
          <button onClick={onShowHistory} className="hover:underline">History</button>
          <a href="#about" className="hover:underline">About</a>
        </nav>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
