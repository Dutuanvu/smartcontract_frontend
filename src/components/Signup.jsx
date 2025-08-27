import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Dummy signup logic
    navigate('/login'); // Redirect to Login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001F3F] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#003366]">Create Account</h1>
          <p className="text-sm text-gray-600">Sign up to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:outline-none"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:outline-none"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:outline-none"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <a
              href="/#/login"
              className="text-yellow-400 font-semibold ml-2 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
