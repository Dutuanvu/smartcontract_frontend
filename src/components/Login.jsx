import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ user, setUser }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // keep exactly what user typed (email or username)
    const enteredValue = identifier.trim();
    setUser(enteredValue);

    alert(`Logged in as ${enteredValue}`);
    navigate('/'); // redirect to home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#001F3F] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#003366]">Welcome Back!</h1>
          <p className="text-sm text-gray-600">
            {user ? `Hello, ${user}!` : "Please login to your account"}
          </p>
        </div>

        {/* If not logged in → show form */}
        {!user ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="Enter username or email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300"
            >
              Login
            </button>
          </form>
        ) : (
          // If logged in → show username/email button only
          <button
            className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300"
            onClick={() => navigate('/')}
          >
            {user}
          </button>
        )}

        {/* Sign Up link (only if not logged in) */}
        {!user && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?
              <button
                className="text-yellow-500 font-semibold ml-2 hover:underline"
                onClick={() => navigate('/')}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
