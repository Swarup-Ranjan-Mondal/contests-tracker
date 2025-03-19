import { useEffect, useState, useContext, useCallback } from "react";
import ContestCard from "../components/ContestCard";
import PlatformFilter from "../components/PlatformFilter";
import Pagination from "../components/Pagination";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [contests, setContests] = useState([]);
  const [ongoingContests, setOngoingContests] = useState([]);
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const togglePlatform = useCallback((platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
    setCurrentPage(1);
  }, []);

  const fetchBookmarkedContests = useCallback(async () => {
    try {
      const response = await fetch(`/api/contests/bookmarks`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.status === 401) return logout();

      const bookmarks = await response.json();
      setBookmarkedContests(new Set(bookmarks.map((contest) => contest._id)));
    } catch (error) {
      console.error("Error fetching bookmarked contests:", error);
    }
  }, [user, logout]);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedPlatforms.length) {
        queryParams.append("platform", selectedPlatforms.join(","));
      }
      queryParams.append("page", currentPage);
      queryParams.append("limit", 12);

      try {
        const response = await fetch(
          `/api/contests?${queryParams.toString().toLowerCase()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (response.status === 401) return logout();

        const data = await response.json();
        setContests(data.upcomingContests);
        setOngoingContests(data.ongoingContests);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
      setLoading(false);
    };

    fetchContests();
    fetchBookmarkedContests();
  }, [selectedPlatforms, currentPage, fetchBookmarkedContests, user, logout]);

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark"
          ? "bg-gray-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Platform Filter */}
      <PlatformFilter
        selectedPlatforms={selectedPlatforms}
        togglePlatform={togglePlatform}
      />

      {/* Ongoing Contests Section */}
      {ongoingContests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ongoing Contests</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {ongoingContests.map((contest) => (
              <ContestCard
                key={contest._id}
                contest={contest}
                bookmarks={bookmarkedContests}
                fetchBookmarkedContests={fetchBookmarkedContests}
                isOngoing={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Contests Section */}
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>

      {loading ? (
        <div className="text-center text-gray-400">Loading contests...</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {contests?.length > 0 ? (
              contests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  bookmarks={bookmarkedContests}
                  fetchBookmarkedContests={fetchBookmarkedContests}
                />
              ))
            ) : (
              <p
                className={`text-center ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No contests found.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
