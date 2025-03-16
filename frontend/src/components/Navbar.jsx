import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      {/* Desktop Navbar (Default View) */}
      <div className="hidden md:flex justify-between items-center">
        <h1 className="text-xl font-bold">Contest Tracker</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/past" className="hover:underline">
            Past Contests
          </Link>
          {user ? (
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Navbar */}
      <div className="md:hidden flex items-center justify-between">
        <button 
          className="focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Contest Tracker</h1>
      </div>

      {/* Mobile Menu - Centered */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-blue-700 p-4 mt-2 rounded-lg">
          <Link to="/" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/past" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>
            Past Contests
          </Link>
          {user ? (
            <button onClick={logout} className="py-2 hover:underline">
              Logout
            </button>
          ) : (
            <Link to="/login" className="py-2 hover:underline" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
