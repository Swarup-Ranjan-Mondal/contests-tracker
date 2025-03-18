import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PastContests from "./pages/PastContests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinkSolution from "./pages/LinkSolution";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/past" element={<ProtectedRoute><PastContests /></ProtectedRoute>} />
        <Route path="/link-solution/:contestId" element={<LinkSolution />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
