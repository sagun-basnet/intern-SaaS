const bookmarkService = require('../services/bookmark.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, created } = require('../utils/apiResponse');

// POST /api/bookmarks/jobs/:jobId
const addBookmark = asyncHandler(async (req, res) => {
  const data = await bookmarkService.addBookmark(req.user.id, parseInt(req.params.jobId));
  return created(res, 'Job bookmarked.', data);
});

// DELETE /api/bookmarks/jobs/:jobId
const removeBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.removeBookmark(req.user.id, parseInt(req.params.jobId));
  return success(res, 'Bookmark removed.');
});

// GET /api/bookmarks
const getBookmarks = asyncHandler(async (req, res) => {
  const data = await bookmarkService.getBookmarks(req.user.id);
  return success(res, 'Saved jobs fetched.', data);
});

module.exports = { addBookmark, removeBookmark, getBookmarks };
