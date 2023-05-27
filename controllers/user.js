const moment = require("moment/moment");
const User = require("../models/User");

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
	try {
		const data = await User.find();
		return res.status(200).json(data);
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
