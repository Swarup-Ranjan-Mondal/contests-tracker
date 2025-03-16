import { useEffect, useState } from "react";

const PastContests = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await fetch("http://localhost:6000/api/contests/past");
      const data = await response.json();
      setContests(data);
    };
    fetchContests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Past Contests</h2>
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

export default PastContests;