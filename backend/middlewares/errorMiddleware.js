const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Server Error',
  });
};

export default errorHandler;