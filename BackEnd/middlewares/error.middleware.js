const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    // Log for development
    console.error("🚨 Database Error:", {
      code: err.code,
      detail: err.detail,
      message: err.message,
    });

    // 1. Postgres Violation code for (Duplicate Key)
    // SQLSTATE 23505: e.g., registering with an email that already exists
    if (err.code === "23505") {
      const message =
        "Duplicate field value entered. This record already exists.";
      error = new Error(message);
      error.statusCode = 400;
    }

    // 2. Postgres Foreign Key Violation
    // SQLSTATE 23503: e.g., creating a project for a buyerId that doesn't exist
    if (err.code === "23503") {
      const message =
        "Resource reference not found. The related ID provided is invalid.";
      error = new Error(message);
      error.statusCode = 404;
    }

    // 3. Postgres Invalid Input Syntax (The new "CastError")
    // SQLSTATE 22P02: e.g., passing "not-a-uuid" into a UUID column
    if (err.code === "22P02") {
      const message = "Invalid input format. Check your IDs and data types.";
      error = new Error(message);
      error.statusCode = 400;
    }

    // 4. Postgres Not Null Violation
    // SQLSTATE 23502: e.g., missing a required field
    if (err.code === "23502") {
      const message = `Missing required field: ${err.column || "check your input"}`;
      error = new Error(message);
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
      // below code, Only show code in development to help  debug
      ...(process.env.NODE_ENV === "development" && { pgCode: err.code }),
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
