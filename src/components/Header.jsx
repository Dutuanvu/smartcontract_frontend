import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser, onShowHistory }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Scroll with header offset
  const scrollWithOffset = (id) => {
    const el = document.getElementById(id);
    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

    const handleLogoClick = () => {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

  const handleAboutClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollWithOffset("about"), 50);
    } else {
      scrollWithOffset("about");
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-[#003366] text-white px-8 py-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <button onClick={handleLogoClick} className="flex items-center font-bold text-xl hover:opacity-90">
        <span className="text-yellow-400 mr-2 text-2xl">🛡️</span>
        <span className="text-white">SmartContractScanner</span>
      </button>

      {/* Navigation */}
      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6">
          <button onClick={handleAboutClick} className="hover:underline font-medium transition duration-200">
            About
          </button>
          <button onClick={onShowHistory} className="hover:underline font-medium transition duration-200">
            History
          </button>
        </nav>

        {/* Authentication Buttons */}
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold shadow-md">
              {user}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-yellow-400 font-semibold hover:underline">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-400 to-green-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-600 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
