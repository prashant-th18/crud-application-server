const express = require("express");
const user = require("../controllers/user");
const upload = require("../multer/storageConfig");

const router = new express.Router();

router.post("/user/register", upload.single("user_profile"), user.register);
// This means, apply multer on a signle uploaded file with the name as "user_profile"

router.get("/details", user.getDetails);

router.get("/user/:id", user.getUserData);

router.put("/user/edit/:id", upload.single("user_profile"), user.editData);

router.delete("/user/delete/:id", user.deleteUser);

router.put("/user/status/:id", user.editStatus);

module.exports = router;
