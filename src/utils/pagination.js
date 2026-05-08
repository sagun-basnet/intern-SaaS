/**
 * Pagination helper
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {{ skip, take, page, limit }}
 */
const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;

  return { skip, take: parsedLimit, page: parsedPage, limit: parsedLimit };
};

/**
 * Build pagination metadata object
 * @param {number} total - Total record count from DB
 * @param {number} page
 * @param {number} limit
 */
const buildPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { getPagination, buildPaginationMeta };
