
// class to handle API errors
class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {

    super(message),
    //   (this.message = message),
      (this.statusCode = statusCode),
      (this.errors = errors),
      (this.success = false);
  }
}

export { ApiError };
