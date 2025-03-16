import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Contest Tracker</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/past" className="hover:underline">
          Past Contests
        </Link>
        <Link to="/bookmarks" className="hover:underline">
          Bookmarks
        </Link>
        {user ? (
          <Link to="#" onClick={logout} className="hover:underline">
            Logout
          </Link>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
