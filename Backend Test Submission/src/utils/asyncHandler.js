const asyncHandler = (fn) => {
  return (req, res, next) => {
    
    // Execute the function and catch any errors
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error); // Pass the error to the next middleware
    });
  };
};

export { asyncHandler };
