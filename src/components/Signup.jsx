import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001F3F] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#003366]">Create Account</h1>
          <p className="text-sm text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-400 focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-yellow-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="text-yellow-400 font-semibold ml-2 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
