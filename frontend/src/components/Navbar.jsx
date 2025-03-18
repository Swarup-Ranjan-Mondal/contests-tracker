import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext); // Theme Context for toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center">
        <h1 className="text-xl font-bold">Contest Tracker</h1>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/past" className="hover:underline">Past Contests</Link>
          {user ? (
            <button onClick={logout} className="hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            {theme === "dark" ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between">
        <button className="focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Contest Tracker</h1>
        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          {theme === "dark" ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-blue-700 p-4 mt-2 rounded-lg">
          <Link to="/" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/past" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>Past Contests</Link>
          {user ? (
            <button onClick={logout} className="py-2 hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
