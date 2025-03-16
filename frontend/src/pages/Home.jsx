import { useEffect, useState } from "react";

const Home = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const fetchContests = async () => {
    const query = selectedPlatforms.length ? `?platform=${selectedPlatforms.join(",")}`.toLowerCase() : "";
    const response = await fetch(`/api/contests${query}`);
    const data = await response.json();
    setContests(data);
  };

  useEffect(() => {
    fetchContests();
  }, [selectedPlatforms]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
      <div className="mb-4">
        {["Codeforces", "Leetcode", "CodeChef"].map((platform) => (
          <button
            key={platform}
            className={`px-4 py-2 m-1 rounded ${
              selectedPlatforms.includes(platform) ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </button>
        ))}
      </div>
      <ul>
        {contests.map((contest) => (
          <li key={contest._id} className="p-3 border-b">
            <strong>{contest.name}</strong> - {contest.platform} ({new Date(contest.startTime).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;