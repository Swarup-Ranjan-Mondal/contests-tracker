import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";

// ✅ Normalize text (clean unnecessary words & characters, but KEEP contest numbers)
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/leetcode\s*/i, "")  // Remove "LeetCode" prefix
        .replace(/[^a-z0-9\s-]/gi, "")  // Remove special characters (keep "-" for readability)
        .replace(/\s+/g, " ")          // Trim extra spaces
        .trim();
}

// ✅ Extract contest number (e.g., "Weekly Contest 387" → 387)
function extractContestNumber(name) {
    const match = name.match(/\b(?:weekly|biweekly)?\s*contest\s*(\d+)\b/i);
    return match ? parseInt(match[1], 10) : null;
}

// ✅ Extract contest type (e.g., "Weekly Contest", "Biweekly Contest")
function extractContestType(name) {
    const match = name.match(/\b(weekly contest|biweekly contest)\b/i);
    return match ? match[1].toLowerCase() : null;
}

// ✅ Find the best matching YouTube video
function findBestMatchingVideo(contest, videoList) {
    const contestName = normalizeText(contest.name);
    const contestType = extractContestType(contest.name);
    const contestNumber = extractContestNumber(contest.name);

    let bestMatch = null;
    let bestSimilarity = 0;

    for (const video of videoList) {
        let videoTitle = normalizeText(video.title);
        const videoType = extractContestType(video.title);
        const videoNumber = extractContestNumber(video.title);

        // 🎯 Priority 1: Exact contest number match
        if (contestNumber !== null && videoNumber !== null && contestNumber !== videoNumber) {
            continue;
        }

        // 🎯 Priority 2: Exact contest type match
        if (contestType && videoType && contestType !== videoType) {
            continue;
        }

        // 🔥 Compute similarity score
        const similarity = stringSimilarity.compareTwoStrings(contestName, videoTitle);

        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = video;
        }
    }

    // 🔥 Fallback: Fuzzy search if no good match is found
    if (!bestMatch || bestSimilarity < 0.35) {
        const fuse = new Fuse(videoList, {
            keys: ["title"],
            threshold: 0.4,  // Slightly relaxed threshold
            includeScore: true
        });

        const results = fuse.search(contestName);

        if (results.length > 0) {
            const candidate = results[0].item;
            const candidateNumber = extractContestNumber(candidate.title);

            // Ensure contest number is either exact OR close (±2)
            if (candidateNumber && Math.abs(candidateNumber - contestNumber) <= 2) {
                bestMatch = candidate;
                bestSimilarity = stringSimilarity.compareTwoStrings(contestName, normalizeText(bestMatch.title));
            }
        }
    }

    return bestMatch;
}

// ✅ Match LeetCode contests with YouTube videos
export async function matchLeetCodeContestsWithVideos(contestList, videoList) {
    return contestList.map(contest => {
        const bestMatch = findBestMatchingVideo(contest, videoList);

        if (bestMatch) {
            console.log(`✅ Best Match for "${contest.name}" → "${bestMatch.title}"`);
        }

        return {
            contest_name: contest.name,
            video_title: bestMatch ? bestMatch.title : null,
            youtube_url: bestMatch ? bestMatch.video_url : null
        };
    });
}