import { useEffect, useState, useContext } from "react";
import PlatformFilter from "../components/PlatformFilter";
import ContestCard from "../components/ContestCard";
import Pagination from "../components/Pagination";
import AuthContext from "../context/AuthContext";

const PastContests = () => {
  const { user } = useContext(AuthContext);

  const [contests, setContests] = useState([]);
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
    setPage(1);
  };

  // Fetch past contests
  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedPlatforms.length) {
          queryParams.append(
            "platform",
            selectedPlatforms.map((p) => p.toLowerCase()).join(",")
          );
        }
        queryParams.append("page", page);
        queryParams.append("limit", 12);

        const response = await fetch(
          `/api/contests/past?${queryParams.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch contests");

        const data = await response.json();
        setContests(data.contests);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching past contests:", error);
      }
      setLoading(false);
    };

    fetchContests();
  }, [selectedPlatforms, page]);

  // Fetch bookmarked contests once on mount
  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch(`/api/contests/bookmarks`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch bookmarks");

        const bookmarks = await response.json();
        setBookmarkedContests(new Set(bookmarks.map((contest) => contest._id)));
      } catch (error) {
        console.error("Error fetching bookmarked contests:", error);
      }
    };

    fetchBookmarkedContests();
  }, [user]);

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>

      <PlatformFilter
        selectedPlatforms={selectedPlatforms}
        togglePlatform={togglePlatform}
      />

      {loading ? (
        <div className="text-center text-gray-400">Loading contests...</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {contests.length > 0 ? (
              contests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  isPast={true}
                  isBookmarked={bookmarkedContests.has(contest._id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">
                No past contests found.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              setCurrentPage={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PastContests;
