require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const router = require("./routes/router");

const DB = process.env.DATABASE;
const PORT = 6010;

const app = express();

app.use(cors());
app.use(express.json());

// The below line means that, if we have a request on "/uploads", then, it should be considered that, we are statically located at the uploads folder
app.use("/uploads", express.static("./uploads"));
app.use("/files", express.static("./public/files"));
app.use(router);

mongoose
	.connect(DB, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Connected");
		app.listen(PORT, () => {
			console.log(`Server Started at port ${PORT}`);
		});
	})
	.catch((err) => console.log(err));
