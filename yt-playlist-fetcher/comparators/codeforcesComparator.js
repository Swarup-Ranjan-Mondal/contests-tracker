import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";

// Normalize text (convert to lowercase, remove special characters, and extra spaces)
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[#\.\-\|:,()]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// Extract round number (e.g., "Round 1009")
function extractRoundNumber(name) {
    const match = name.match(/\b(?:round|#)\s*(\d+)\b/i);
    return match ? parseInt(match[1], 10) : null;
}

// Extract division (e.g., "Div. 1", "Div. 2", "Div. 3", "Div. 1+2")
function extractDivision(name) {
    const match = name.match(/\bdiv(?:ision)?\.?\s*(\d(?:\+\d)?)\b/i);
    return match ? match[1] : null;
}

// Extract contest type (e.g., "Codeforces Round", "Educational Codeforces Round")
function extractContestType(name) {
    const match = name.match(/\b(codeforces round|educational codeforces round|round)\b/i);
    return match ? match[1] : null;
}

// Find best matching video using stricter rules
function findBestMatchingVideo(contest, videoList) {
    const contestName = normalizeText(contest.name);
    const contestRound = extractRoundNumber(contest.name);
    const contestDivision = extractDivision(contest.name);
    const contestType = extractContestType(contest.name);

    let bestMatch = null;
    let bestSimilarity = 0;

    for (const video of videoList) {
        const videoTitle = normalizeText(video.title);
        const videoRound = extractRoundNumber(video.title);
        const videoDivision = extractDivision(video.title);
        const videoType = extractContestType(video.title);

        // Priority 1: Exact contest type match
        if (contestType && videoType && contestType !== videoType) {
            continue;
        }

        // Priority 2: Exact round match
        if (contestRound !== null && videoRound !== null && contestRound !== videoRound) {
            continue;
        }

        // Priority 3: Exact division match (if available)
        if (contestDivision !== null && videoDivision !== null && contestDivision !== videoDivision) {
            continue;
        }

        // Compute similarity score
        const similarity = stringSimilarity.compareTwoStrings(contestName, videoTitle);

        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = video;
        }
    }

    // Fuzzy search as a fallback with stricter threshold
    if (!bestMatch) {
        const fuse = new Fuse(videoList, {
            keys: ["title"],
            threshold: 0.2,
            includeScore: true
        });

        const results = fuse.search(contestName);
        if (results.length > 0) {
            bestMatch = results[0].item;
            bestSimilarity = stringSimilarity.compareTwoStrings(contestName, normalizeText(bestMatch.title));
        }
    }

    return bestSimilarity > 0.4 ? bestMatch : null;
}

// Match Codeforces contests with YouTube videos
export async function matchCodeforcesContestsWithVideos(contestList, videoList) {
    return contestList.map(contest => {
        const bestMatch = findBestMatchingVideo(contest, videoList);

        if (bestMatch) {
            console.log(`✅ Best Match for "${contest.name}" → "${bestMatch.title}"`);
        }

        return {
            ...contest._doc,
            youtube_url: bestMatch ? bestMatch.video_url : null
        };
    });
}
