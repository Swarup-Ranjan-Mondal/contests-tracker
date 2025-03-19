import { useState, useEffect, useContext } from "react";
import { FaYoutube, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";

const LinkSolution = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [contest, setContest] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { contestId } = useParams();

  useEffect(() => {
    const fetchContestDetails = async () => {
      if (!user) return logout();

      try {
        const response = await fetch(`/api/contests/${contestId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.status === 401) return logout();

        const data = await response.json();
        setContest(data);
        setYoutubeUrl(data.youtube_url || "");
      } catch (error) {
        console.error("Error fetching contest details:", error);
        setMessage("Failed to fetch contest details.");
      }
    };

    fetchContestDetails();
  }, [contestId, user]);

  // Platform Logo Paths
  const getPlatformLogo = (platform, theme) => {
    switch (platform.toLowerCase()) {
      case "leetcode":
        return "/logos/leetcode.png";
      case "codeforces":
        return "/logos/codeforces.png";
      case "codechef":
        return theme === "dark"
          ? "/logos/codechef-dark.svg"
          : "/logos/codechef.svg";
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

  const getFormattedTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const getDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    return minutes === 0
      ? `${hours} hr${hours > 1 ? "s" : ""}`
      : `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    try {
      const response = await fetch(
        `/api/contests/${contest._id}/youtube-link`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtube_url: youtubeUrl }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("YouTube link added successfully!");
        setTimeout(() => navigate("/past"), 750);
      } else {
        setMessage(data.error || "Failed to add link.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setMessage("Error submitting data.");
    }

    setTimeout(() => setMessage(""), 1500);
  };

  if (!contest) {
    return <p className="text-gray-500">Loading contest details...</p>;
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-gray-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-xl mx-auto mt-10 p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-500">
          Attach YouTube Video Solution
        </h2>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <p className="text-gray-400 font-semibold">Contest Name:</p>
            <p>{contest.name}</p>
          </div>

          <div className="flex justify-between gap-8">
            <div className="w-1/2 flex items-center gap-5">
              {getPlatformLogo(contest.platform, theme) ? (
                <img
                  src={getPlatformLogo(contest.platform, theme)}
                  alt={`${contest.platform} logo`}
                  className="h-12 w-12 object-contain"
                />
              ) : null}
              <div className="flex flex-col">
              <p className="text-gray-400 font-semibold">Platform:</p>
              <p>{getPlatformDisplayName(contest.platform)}</p>
              </div>
            </div>
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Start Time:</p>
              <p>{getFormattedTime(contest.startTime)}</p>
            </div>
          </div>

          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Duration:</p>
              <p>{getDuration(contest.startTime, contest.endTime)}</p>
            </div>
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Contest URL:</p>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 flex items-center gap-2"
              >
                <FaExternalLinkAlt /> Visit Contest
              </a>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 font-semibold">
                YouTube Solution URL
              </label>
              <div className="flex items-center gap-2 mt-1">
                <FaYoutube className="text-red-500" size={36} />
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=example"
                  className={`w-full p-2 h-10 border rounded-lg focus:outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                      : "bg-gray-100 border-gray-300 focus:ring-blue-600"
                  }`}
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Submit and Back Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => navigate("/past")}
                type="button"
                className="w-full p-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold text-white cursor-pointer"
              >
                ← Back to Past Contests
              </button>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkSolution;
