export function errorHandler(err, req, res, _next) {
  console.error('Error encountered:', err.message || err);
  
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorHandler;
