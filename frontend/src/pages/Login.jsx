import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password, navigate);
    } catch (err) {
      setError(err.message ?? "Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`w-full max-w-md mx-auto mt-10 rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                : "bg-gray-50 border-gray-300 focus:ring-blue-400"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                : "bg-gray-50 border-gray-300 focus:ring-blue-400"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={`mt-4 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
