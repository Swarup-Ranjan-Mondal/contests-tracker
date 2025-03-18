import { useState, useEffect, useContext } from "react";
import { FaYoutube, FaExternalLinkAlt } from "react-icons/fa";
import { data, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LinkSolution = () => {
  const { user, logout } = useContext(AuthContext);

  const [contest, setContest] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { contestId } = useParams();

  useEffect(() => {
    const fetchContestDetails = async () => {
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
      }
    };

    if(!user) return logout();
    fetchContestDetails();
  }, [contestId, user]);

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

    if (minutes === 0) {
      return `${hours} hr${hours > 1 ? "s" : ""}`;
    }
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    try {
      const response = await fetch(`/api/contests/${contest._id}/youtube-link`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("YouTube link added successfully!");
      } else {
        setMessage(data.message || "Failed to add link.");
      }
    } catch (error) {
      setMessage("Error submitting data.");
      console.error(error);
    }
  };

  if (!contest) {
    return <p className="text-white">Loading contest details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-blue-500">
          Attach YouTube Video Solution
        </h2>

        {message && (
          <p
            className={`mb-4 text-center transition-all duration-300 ${
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
            <p className="text-white break-words">{contest.name}</p>
          </div>

          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Platform:</p>
              <p className="text-white">{contest.platform}</p>
            </div>
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Start Time:</p>
              <p className="text-white">
                {getFormattedTime(contest.startTime)}
              </p>
            </div>
          </div>

          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Duration:</p>
              <p className="text-white">
                {getDuration(contest.startTime, contest.endTime)}
              </p>
            </div>
            <div className="w-1/2">
              <p className="text-gray-400 font-semibold">Contest URL:</p>
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 flex items-center gap-2"
              >
                <FaExternalLinkAlt /> Visit Contest
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-400 font-semibold">
                YouTube Solution URL
              </label>
              <div className="flex items-center gap-2 mt-1">
                <FaYoutube className="text-red-500" size={36} />
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=rjUwmXD9N3k"
                  className="w-full p-2 h-10 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white"
              >
                ← Back to Past Contests
              </button>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
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
