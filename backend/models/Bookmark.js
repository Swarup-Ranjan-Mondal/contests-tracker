import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Contest", required: true },
  },
  { timestamps: true }
);

// Indexing to ensure unique bookmarks and faster lookups
bookmarkSchema.index({ userId: 1, contestId: -1 }, { unique: true });

// Index for fetching reminders efficiently
bookmarkSchema.index({ userId: 1, "contestId.startTime": 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
