const multer = require("multer");

// Defining diskStorage Engine
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		// callback function will be executed once we are here
		callback(null, "./uploads");
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}-${file.originalname}`);
	},
});

// fileFilter
const fileFilter = (req, file, callback) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		callback(null, true);
	} else {
		callback(new Error("Wrong Image Type"), false);
	}
};

module.exports = multer({
	storage: storage,
	fileFilter: fileFilter,
});
