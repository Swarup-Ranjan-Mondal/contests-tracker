import { useEffect, useState } from "react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:6000/api/contests/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBookmarks(data);
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bookmarked Contests</h2>
      <ul>
        {bookmarks.map((contest) => (
          <li key={contest._id} className="p-3 border-b">
            <strong>{contest.name}</strong> - {contest.platform} ({new Date(contest.startTime).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookmarks;