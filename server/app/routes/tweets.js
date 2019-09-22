const express = require('express');
const Joi = require('@hapi/joi');
const moment = require('moment');
const Tweet = require('../models/tweet.model.js');
const twitter = require('../tools/getTweets.js');

const router = express.Router();

// Joi schema for search
const schema = Joi.object().keys({
	topic: Joi.string()
		.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ -_]{3,100}$/)
		.required(),
	count: Joi.number()
		.min(1)
		.max(100)
		.required(),
	latitude: Joi.number()
		.min(-90)
		.max(90)
		.required(),
	longitude: Joi.number()
		.min(-180)
		.max(180)
		.required(),
	radius: Joi.number()
		.min(1)
		.max(200)
		.required()
});

// Get all tweets
router.get('/tweets', async (req, res) => {
	try {
		const tweets = await Tweet.find();
		res.json(tweets);
	} catch (error) {
		res.json({ message: error });
	}
});

router.post('/tweets', async (req, res) => {
	const result = schema.validate(req.body);
	if (result.error === null) {
		// Get the values from the body of the request
		const { topic, radius, count, latitude, longitude } = req.body;
		let tweets = await twitter.getTweets(
			topic,
			radius,
			count,
			latitude,
			longitude
		);

		try {
			console.log('Number of tweets', tweets.length);
			if (tweets.length == 0) {
				res.status(404).json({
					message: 'No tweets for this city or topic :('
				});
			} else {
				Tweet.find(
					{
						topic: topic,
						coordinates: [latitude, longitude],
						radius: radius,
						date: moment().format('L')
					},
					function(err, count) {
						console.log(count.length);
						if (count.length > 0) {
							console.log('it exits already');
							res.redirect(
								`tweets/${topic}/${latitude}/${longitude}/${radius}`
							);
						} else {
							Tweet.collection
								.insertMany(tweets)
								.then(() => {
									console.log('Tweets inserted!');
									res.redirect(
										`tweets/${topic}/${latitude}/${longitude}/${radius}`
									);
								})
								.catch(err => console.log(err));
						}
					}
				);
			}
		} catch (error) {
			res.json({ message: error });
		}
	} else {
		res.status(400).json({
			Error: 'validation of the body failed'
		});
	}
	// Get tweets of a given topic, city & count
});
// Get all the tweets with a given topic
router.get('/tweets/:topic', async (req, res) => {
	try {
		const queryTweets = await Tweet.find({
			topic: req.params.topic
		});
		if (queryTweets.length == 0) {
			res.json({
				message: 'No tweets available for this topic or this city'
			});
		}
		res.json(queryTweets);
	} catch (error) {
		res.status(404).json({ message: error });
	}
});

// Give the tweets with a given topic & a given city
router.get('/tweets/:topic/:latitude/:longitude/:radius', async (req, res) => {
	try {
		const queryTweets = await Tweet.find({
			topic: req.params.topic,
			coordinates: [
				parseFloat(req.params.latitude),
				parseFloat(req.params.longitude)
			],
			radius: req.params.radius
		});
		if (queryTweets.length == 0) {
			res.status(404).json({
				message: 'No tweets available for this topic or this city'
			});
		} else {
			res.status(200).json(queryTweets);
		}
	} catch (error) {
		res.json({ message: error });
	}
});

// Fetch tweets on a given topic

module.exports = router;
