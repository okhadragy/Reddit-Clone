const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File size too large. Max allowed size is 20MB."
          : err.message,
    });
  }

  if (
    err.message === "Only image and video files are allowed!" ||
    err.message === "Only image files are allowed!"
  ) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  next(err);
};

module.exports = errorHandler;
