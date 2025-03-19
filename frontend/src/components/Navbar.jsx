import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center">
        <Link to="/" className="flex justify-between items-center gap-4">
          <img
            src={"/icon.png"}
            alt={`Tracker logo`}
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-2xl font-bold">Contest Tracker</h1>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/past" className="hover:underline">
            Past Contests
          </Link>
          {user ? (
            <button
              onClick={onLogout}
              className="hover:underline cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun size={24} className="text-yellow-400" />
            ) : (
              <Moon size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between">
        <button
          className="focus:outline-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <Link to="/" className="flex justify-between items-center gap-4">
          <img
            src={"/icon.png"}
            alt={`Tracker logo`}
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-2xl font-bold flex-1 text-center">
            Contest Tracker
          </h1>
        </Link>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun size={24} className="text-yellow-400" />
          ) : (
            <Moon size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-blue-700 p-4 mt-2 rounded-lg">
          <Link
            to="/"
            className="py-2 hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/past"
            className="py-2 hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Past Contests
          </Link>
          {user ? (
            <button
              onClick={onLogout}
              className="py-2 hover:underline cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="py-2 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
