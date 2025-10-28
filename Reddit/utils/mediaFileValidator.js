const path = require("path");
const fs = require("fs");

const mediaFileValidator = (folder) => {
  return {
    validator: function (v) {
      const isMedia = /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i.test(v);
      if (!isMedia) return false;

      const filePath = path.join(__dirname, `../uploads/${folder}`, v);
      return fs.existsSync(filePath);
    },
    message: "Must be an existing image or video file (jpg, jpeg, png, gif, mp4, mov, avi, webm)",
  };
};

module.exports = mediaFileValidator;
