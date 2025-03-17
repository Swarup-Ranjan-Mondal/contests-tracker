import stringSimilarity from "string-similarity";
import Fuse from "fuse.js";

// Normalize text by removing unnecessary words and characters
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/(rated till \d+ star|rated upto \d+)/gi, "")  // Remove "Rated till X star" and similar phrases
        .replace(/[^a-z0-9\s]/gi, "")  // Remove special characters except spaces
        .replace(/\s+/g, " ")          // Remove extra spaces
        .trim();
}

// Extract contest number (e.g., "Starters 177")
function extractContestNumber(name) {
    const match = name.match(/\b(?:starters|cook-off|lunchtime|long challenge)?\s*(\d+)\b/i);
    return match ? parseInt(match[1], 10) : null;
}

// Extract contest type (e.g., "Starters", "Cook-Off", "Lunchtime")
function extractContestType(name) {
    const match = name.match(/\b(starters|cook-off|lunchtime|long challenge)\b/i);
    return match ? match[1] : null;
}

// Find the best matching YouTube video
function findBestMatchingVideo(contest, videoList) {
    const contestName = normalizeText(contest.name);
    const contestType = extractContestType(contest.name);
    const contestNumber = extractContestNumber(contest.name);

    let bestMatch = null;
    let bestSimilarity = 0;

    for (const video of videoList) {
        let videoTitle = normalizeText(video.title).replace(/^codechef /, ""); // Remove "CodeChef" prefix if present
        const videoType = extractContestType(videoTitle);
        const videoNumber = extractContestNumber(videoTitle);

        // Priority 1: Exact contest number match
        if (contestNumber !== null && videoNumber !== null && contestNumber !== videoNumber) {
            continue;
        }

        // Priority 2: Exact contest type match
        if (contestType && videoType && contestType !== videoType) {
            continue;
        }

        // Compute similarity score
        const similarity = stringSimilarity.compareTwoStrings(contestName, videoTitle);

        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = video;
        }
    }

    // Fuzzy search as a fallback (if no good match found)
    if (!bestMatch) {
        const fuse = new Fuse(videoList, {
            keys: ["title"],
            threshold: 0.3,  // Slightly relaxed threshold for CodeChef
            includeScore: true
        });

        const results = fuse.search(contestName);
        if (results.length > 0) {
            const candidate = results[0].item;
            const candidateNumber = extractContestNumber(candidate.title);

            // Ensure the contest number is either exact OR not completely different
            if (candidateNumber && Math.abs(candidateNumber - contestNumber) <= 2) {  
                bestMatch = candidate;
                bestSimilarity = stringSimilarity.compareTwoStrings(contestName, normalizeText(bestMatch.title));
            }
        }
    }

    if (bestMatch) {
        console.log(`✅ Best Match for "${contest.name}" → "${bestMatch.title}"`);
    }

    return bestSimilarity > 0.4 ? bestMatch : null;  // Higher threshold for acceptance
}

// Match CodeChef contests with YouTube videos
export async function matchCodeChefContestsWithVideos(contestList, videoList) {
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
