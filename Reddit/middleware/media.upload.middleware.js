const multer = require("multer");
const path = require("path");

const uploadTo = (folder) => {
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join("uploads", folder));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];

    if (fileType === "image" || fileType === "video") {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  };

  // 20 MB limit — prevents large video uploads from crashing your app
  const limits = { fileSize: 20 * 1024 * 1024 };

  return multer({ storage: diskStorage, fileFilter, limits });
};

module.exports = uploadTo;
