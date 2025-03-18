import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";

const PlatformFilter = ({ selectedPlatforms, togglePlatform }) => {
  const platforms = ["Codeforces", "Leetcode", "CodeChef"];
  const { theme } = useContext(ThemeContext);

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <button
          key={platform}
          className={`px-4 py-2 rounded font-semibold transition-all ${
            selectedPlatforms.includes(platform)
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-900"
          }`}
          onClick={() => togglePlatform(platform)} 
        >
          {platform}
        </button>
      ))}
    </div>
  );
};

export default PlatformFilter;
