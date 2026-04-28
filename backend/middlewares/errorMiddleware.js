const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for ${Object.keys(err.keyValue).join(', ')}`;
  }
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res.status(statusCode).json({
    status: err.status || 'error',
    message,
  });
};

export default errorHandler;