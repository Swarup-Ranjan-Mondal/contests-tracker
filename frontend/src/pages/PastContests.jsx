import { useEffect, useState, useContext, useCallback } from "react";
import ContestCard from "../components/ContestCard";
import PlatformFilter from "../components/PlatformFilter";
import Pagination from "../components/Pagination";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const PastContests = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [contests, setContests] = useState([]);
  const [bookmarkedContests, setBookmarkedContests] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const togglePlatform = useCallback((platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
    setPage(1);
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
  }, []);

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
          `/api/contests/past?${queryParams.toString()}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (response.status === 401) return logout();

        const data = await response.json();
        setContests(data.contests);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching past contests:", error);
      }
      setLoading(false);
    };

    fetchContests();
    fetchBookmarkedContests();
  }, [selectedPlatforms, page, fetchBookmarkedContests, user, logout]);

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

      {/* Past Contests Section */}
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>
      {loading ? (
        <div className="flex justify-center items-center h-100">
          <div
            className={`text-center text-xl font-semibold ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading contests...
          </div>
        </div>
      ) : (
        <>
          {contests.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {contests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  isPast={true}
                  bookmarks={bookmarkedContests}
                  fetchBookmarkedContests={fetchBookmarkedContests}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-100">
              <p
                className={`text-center text-xl font-semibold ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No past contests found.
              </p>
            </div>
          )}

          {/* Pagination */}
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
