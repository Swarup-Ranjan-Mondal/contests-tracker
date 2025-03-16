import { useEffect, useState } from "react";
import PlatformFilter from "../components/PlatformFilter";
import ContestCard from "../components/ContestCard";

const PastContests = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
    setPage(1);
  };

  useEffect(() => {
    const fetchContests = async () => {
      const queryParams = new URLSearchParams();
      if (selectedPlatforms.length) {
        queryParams.append("platform", selectedPlatforms.join(",").toLowerCase());
      }
      queryParams.append("page", page);
      queryParams.append("limit", 12); 

      const response = await fetch(`/api/contests/past?${queryParams.toString()}`);
      const data = await response.json();
      setContests(data.contests);
      setTotalPages(data.totalPages);
    };

    fetchContests();
  }, [selectedPlatforms, page]);

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>

      {/* Platform Filter */}
      <PlatformFilter selectedPlatforms={selectedPlatforms} togglePlatform={togglePlatform} />

      {/* Past Contest Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <ContestCard key={contest._id} contest={contest} isPast={true} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 mx-2 rounded ${page === 1 ? "bg-gray-600" : "bg-blue-600"}`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold mx-2">{page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 mx-2 rounded ${page === totalPages ? "bg-gray-600" : "bg-blue-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PastContests;
