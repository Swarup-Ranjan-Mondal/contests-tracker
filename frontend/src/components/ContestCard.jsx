import { useEffect, useState, useContext } from "react";
import { CalendarDays, Clock } from "lucide-react";
import {
  FaRegBookmark,
  FaBookmark,
  FaExternalLinkAlt,
  FaYoutube,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

// Platform Logo Paths
const getPlatformLogo = (platform, theme) => {
  switch (platform) {
    case "leetcode":
      return "/logos/leetcode.png";
    case "codeforces":
      return "/logos/codeforces.png";
    case "codechef":
      return theme !== "dark"
        ? "/logos/codechef.svg"
        : "/logos/codechef-dark.svg";
    default:
      return null;
  }
};

// Convert platform name to Title Case
const getPlatformDisplayName = (platform) => {
  return platform
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const ContestCard = ({ contest, isPast = false, isBookmarked = false }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [timeInfo, setTimeInfo] = useState(
    getTimeInfo(contest.startTime, isPast)
  );
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    if (!isPast) {
      const interval = setInterval(() => {
        setTimeInfo(getTimeInfo(contest.startTime, isPast));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contest.startTime, isPast]);

  function getTimeInfo(startTime, isPast) {
    const now = new Date();
    const contestDate = new Date(startTime);
    const diffMs = now - contestDate;

    if (isPast) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 60) return "Ended a few minutes ago";
      if (diffHours < 24) return `Ended ${diffHours} hours ago`;
      return `Happened ${diffDays} days ago`;
    }

    const futureDiff = contestDate - now;
    if (futureDiff <= 0) return "Starts soon!";

    const days = Math.floor(futureDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((futureDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((futureDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((futureDiff / 1000) % 60);

    return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  const handleBookmark = async () => {
    const method = bookmarked ? "DELETE" : "POST";

    try {
      const response = await fetch(`/api/contests/bookmark`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ contestId: contest._id, userId: user.id }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
      } else if (response.status === 401) {
        return logout();
      } else {
        console.error("Failed to update bookmark:", await response.json());
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  return (
    <div
      className={`p-5 rounded-xl ${
        theme === "dark"
          ? "bg-gray-800 text-white shadow-lg"
          : "bg-white text-gray-900 shadow-md border border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{contest.name}</h3>
        <button onClick={handleBookmark} className="text-2xl text-yellow-400">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Platform Section with Logo */}
      <div className="flex items-center gap-3 mt-2">
        {getPlatformLogo(contest.platform, theme) ? (
          <img
            src={getPlatformLogo(contest.platform, theme)}
            alt={`${contest.platform} logo`}
            className="h-9 w-9 object-contain"
          />
        ) : null}
        <p className="text-gray-400">
          {getPlatformDisplayName(contest.platform)}
        </p>
      </div>

      <p className="text-gray-500 mt-2">
        {new Date(contest.startTime).toLocaleString()}
      </p>

      <div className="flex items-center mt-4 text-blue-400 font-semibold">
        <Clock size={20} className="mr-2" />
        <span>{timeInfo}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {/* Contest Link */}
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-500 hover:text-green-400 font-semibold"
        >
          <FaExternalLinkAlt size={16} /> Go to Contest
        </a>

        {/* Solution Link or Placeholder */}
        {isPast ? (
          contest.youtube_url ? (
            <a
              href={contest.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold"
            >
              <FaYoutube size={20} /> Watch Solution
            </a>
          ) : (
            <span className="text-gray-500 flex items-center gap-2">
              <FaYoutube size={20} /> No Solution Available
            </span>
          )
        ) : null}

        {/* Edit Button */}
        {isPast && (
          <button
            onClick={() => navigate(`/link-solution/${contest._id}`)}
            className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2"
          >
            <FaEdit size={18} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
