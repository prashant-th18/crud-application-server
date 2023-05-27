const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	fname: {
		type: String,
		required: true,
		trim: true, // removes unncessary white spaces from left and right
	},
	lname: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Not a Valid Email");
			}
		},
	},
	mobile: {
		type: String,
		required: true,
		unique: true,
		minlength: 10,
		maxlength: 10,
	},
	gender: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	profile: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	dateCreated: Date,
	dateUpdated: Date,
});

module.exports = mongoose.model("User", userSchema);
