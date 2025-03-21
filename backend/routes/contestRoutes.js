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

router.get("/", authMiddleware, getContests);
router.get("/past", authMiddleware, getPastContests);
router.post("/bookmark", authMiddleware, bookmarkContest);
router.get("/bookmarks", authMiddleware, getBookmarkedContests);
router.delete("/bookmark", authMiddleware, removeBookmark);
router.get("/:contestId", authMiddleware, getContestById);
router.put("/:contestId/youtube-link", authMiddleware, updateYoutubeLink);

export default router;
