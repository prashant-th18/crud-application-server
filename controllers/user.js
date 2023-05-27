const moment = require("moment/moment");
const User = require("../models/User");
const fs = require("fs");
const csv = require("fast-csv");
const BASE_URL = process.env.BASE_URL;

exports.register = async (req, res, next) => {
	// req.file will contain the attached file with the request (the userprofile image)
	// req.body will contain the form data

	const file = req.file.filename;
	const { fname, lname, email, mobile, gender, status, location } = req.body;

	if (
		!fname ||
		!lname ||
		!email ||
		!mobile ||
		!gender ||
		!status ||
		!location ||
		!file
	) {
		res.status(401).json("All Inputs are required");
	}

	try {
		const user = await User.findOne({ email: email });
		console.log(user);
		if (user) {
			res.status(401).json("User Already Exists");
		} else {
			const curDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

			const userData = new User({
				fname,
				lname,
				email,
				mobile,
				gender,
				status,
				location,
				profile: file,
				dateCreated: curDate,
			});
			console.log(userData);

			await userData.save();
			return res.status(200).json(userData);
		}
	} catch (err) {
		console.log(err);
		res.status(401).json(err);
		console.log(`Catch Block Error`);
	}
};

// Gets data of all users
exports.getDetails = async (req, res, next) => {
	const search = req.query.search || "";
	const gender = req.query.gender || "";
	const status = req.query.status || "";
	const sort = req.query.sort || "";
	const page = req.query.page || 1;
	const ITEMS_PER_PAGE = 6;

	const query = {
		fname: {
			$regex: search,
			$options: "i", // This means that, the text will match irrespective of uppercase/lowercase
		},
	};

	// Handling gender
	if (gender !== "All") {
		query.gender = gender;
	}

	// Handling Status
	if (status !== "All") {
		query.status = status;
	}

	try {
		const skip = (page - 1) * ITEMS_PER_PAGE;

		const count = await User.countDocuments(query);

		const data = await User.find(query)
			.sort({
				dateCreated: sort === "new" ? -1 : 1,
			})
			.limit(ITEMS_PER_PAGE)
			.skip(skip);

		const pageCount = Math.floor((count + ITEMS_PER_PAGE - 1) / ITEMS_PER_PAGE);
		return res.status(200).json({
			Pagination: {
				count,
				pageCount,
			},
			data,
		});
	} catch (err) {
		res.status(401).json(err);
	}
};

// gets data of single user
exports.getUserData = async (req, res, next) => {
	const id = req.params.id;

	try {
		const data = await User.findOne({ _id: id });
		res.status(200).json(data);
	} catch (err) {
		res.status(401).json(err);
	}
};

exports.editData = async (req, res, next) => {
	const id = req.params.id;

	const {
		fname,
		lname,
		email,
		mobile,
		gender,
		status,
		location,
		user_profile,
	} = req.body;

	// This is necessary, as it is also possible that user didn't updated the picture
	const file = req.file ? req.file.filename : user_profile;

	const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

	if (
		!fname ||
		!lname ||
		!email ||
		!mobile ||
		!gender ||
		!status ||
		!location ||
		!file
	) {
		res.status(401).json("All Inputs are required");
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			{ _id: id },
			{
				fname,
				lname,
				email,
				mobile,
				gender,
				status,
				location,
				profile: file,
				dateUpdated,
			},
			{ new: true }
		);

		// You should set the new option to true to return the document after update was applied.

		console.log(updatedUser);
		await updatedUser.save();
		res.status(200).json(updatedUser);
	} catch (err) {
		console.log(err);
		res.status(401).json(err);
		console.log(`Catch Block Error`);
	}
};

exports.deleteUser = async (req, res, next) => {
	const id = req.params.id;

	try {
		const deletedUser = await User.findByIdAndDelete({ _id: id });
		res.status(200).json(deletedUser);
	} catch (err) {
		res.status(401).json(err);
	}
};

exports.editStatus = async (req, res, next) => {
	const id = req.params.id;

	const data = req.body;

	try {
		const newUser = await User.findByIdAndUpdate(
			{ _id: id },
			{ status: data.status },
			{ new: true }
		);
		res.status(200).json(newUser);
	} catch (err) {
		console.log(err);
		res.status(401).json(err);
	}
};

exports.exportUser = async (req, res, next) => {
	// Export data to csv file
	try {
		const usersData = await User.find();

		const csvStream = csv.format({ headers: true });

		if (!fs.existsSync("public/files/export")) {
			if (!fs.existsSync("public/files")) {
				fs.mkdirSync("public/files");
			}

			fs.mkdirSync("public/files/export");
		}

		const writableStream = fs.createWriteStream(
			"public/files/export/users.csv"
		);

		csvStream.pipe(writableStream);

		writableStream.on("finish", () => {
			res.json({
				downloadUrl: `${BASE_URL}/files/export/users.csv`,
			});
		});

		if (usersData.length > 0) {
			usersData.map((user) => {
				csvStream.write({
					FirstName: user.fname ? user.fname : "-",
					LastName: user.lname ? user.lname : "-",
					Email: user.email ? user.email : "-",
					Phone: user.mobile ? user.mobile : "-",
					Gender: user.gender ? user.gender : "-",
					Status: user.status ? user.status : "-",
					Profile: user.profile ? user.profile : "-",
					Location: user.location ? user.location : "-",
					DateCreated: user.dateCreated ? user.dateCreated : "-",
					DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
				});
			});
		}

		csvStream.end();
		writableStream.end();
	} catch (err) {
		res.status(401).json(err);
	}
};
