const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
	latitude: { type: Number, required: true },
	longitude: { type: Number, required: true }
});

const TweetsSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true
		},
		tweet: {
			type: String,
			required: true
		},
		topic: {
			type: String,
			required: true
		},
		coordinates: {
			child: [coordinateSchema]
		},
		date: {
			type: String,
			required: true
			//default: Date.now()
		},
		radius: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Tweet', TweetsSchema);
