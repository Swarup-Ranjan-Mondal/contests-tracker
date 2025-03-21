import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getContests,
  getPastContests,
  bookmarkContest,
  getBookmarkedContests,
  removeBookmark,
  getContestById,
  updateYoutubeLink,
} from "../controllers/contestController.js";

const router = express.Router();

// Bypass authentication in tests
if (process.env.NODE_ENV !== "test") {
  router.get("/", authMiddleware, getContests);
  router.get("/past", authMiddleware, getPastContests);
  router.post("/bookmark", authMiddleware, bookmarkContest);
  router.get("/bookmarks", authMiddleware, getBookmarkedContests);
  router.delete("/bookmark", authMiddleware, removeBookmark);
  router.get("/:contestId", authMiddleware, getContestById);
  router.put("/:contestId/youtube-link", authMiddleware, updateYoutubeLink);
} else {
  router.get("/", getContests);
  router.get("/past", getPastContests);
  router.post("/bookmark", bookmarkContest);
  router.get("/bookmarks", getBookmarkedContests);
  router.delete("/bookmark", removeBookmark);
  router.get("/:contestId", getContestById);
  router.put("/:contestId/youtube-link", updateYoutubeLink);
}

export default router;
