import { useEffect, useState } from "react";
import ContestCard from "../components/ContestCard";
import PlatformFilter from "../components/PlatformFilter";

const Home = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const query = selectedPlatforms.length ? `?platform=${selectedPlatforms.join(",")}`.toLowerCase() : "";
      const response = await fetch(`/api/contests${query}`);
      const data = await response.json();
      setContests(data);
    };

    fetchContests();
  }, [selectedPlatforms]);

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>

      {/* Platform Filter */}
      <PlatformFilter selectedPlatforms={selectedPlatforms} togglePlatform={setSelectedPlatforms} />

      {/* Contest Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} />
        ))}
      </div>
    </div>
  );
};

export default Home;
