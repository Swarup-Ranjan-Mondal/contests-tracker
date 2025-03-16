import { useEffect, useState } from "react";
import ContestCard from "../components/ContestCard";
import PlatformFilter from "../components/PlatformFilter";
import Pagination from "../components/Pagination"; // New Pagination Component

const Home = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchContests = async () => {
      const queryParams = new URLSearchParams();
      if (selectedPlatforms.length) {
        queryParams.append("platform", selectedPlatforms.join(","));
      }
      queryParams.append("page", currentPage);
      queryParams.append("limit", 12);

      const response = await fetch(`/api/contests?${queryParams.toString().toLowerCase()}`);
      const data = await response.json();

      setContests(data.contests);
      setTotalPages(data.totalPages);
    };

    fetchContests();
  }, [selectedPlatforms, currentPage]);

  // Toggle platform selection
  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform) 
        : [...prev, platform]
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>

      {/* Platform Filter */}
      <PlatformFilter selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform} />

      {/* Contest Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Home;
