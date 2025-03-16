import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Signup = () => {
    const { signup } = useContext(AuthContext);
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            await signup(name, email, password, navigate);
        } catch (err) {
            setError(err.message ?? "Server error. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Signup</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" className={`w-full p-2 rounded text-white transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}>
                    Signup
                </button>
            </form>
            <p className="mt-4 text-center">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
        </div>
    );
};

export default Signup;
