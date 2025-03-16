import { useEffect, useState } from "react";
import PlatformFilter from "../components/PlatformFilter";
import ContestCard from "../components/ContestCard";

const PastContests = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const query = selectedPlatforms.length ? `?platform=${selectedPlatforms.join(",")}`.toLowerCase() : "";
      const response = await fetch(`/api/contests/past${query}`);
      const data = await response.json();
      setContests(data);
    };

    fetchContests();
  }, [selectedPlatforms]);

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>

      {/* Platform Filter */}
      <PlatformFilter selectedPlatforms={selectedPlatforms} togglePlatform={setSelectedPlatforms} />

      {/* Past Contest Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} isPast={true} />
        ))}
      </div>
    </div>
  );
};

export default PastContests;
