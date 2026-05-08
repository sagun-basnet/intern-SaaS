/**
 * Standard API response helpers
 */

const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const created = (res, message, data = null) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const error = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

const paginated = (res, message, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { success, created, error, paginated };
