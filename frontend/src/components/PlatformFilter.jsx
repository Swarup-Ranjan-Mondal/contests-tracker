const PlatformFilter = ({ selectedPlatforms, togglePlatform }) => {
  const platforms = ["Codeforces", "Leetcode", "CodeChef"];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <button
          key={platform}
          className={`px-4 py-2 rounded ${
            selectedPlatforms.includes(platform) ? "bg-blue-600 text-white" : "bg-gray-700"
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
