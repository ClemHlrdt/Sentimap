const Twit = require('twit');
//const config = require('../../config/twitter.config');
//require('dotenv/config');
const moment = require('moment');
//const pos = require('./geo');

// Fetch coordinates of the given city
// async function fetchWithCoordinates(search) {
// 	let values = await pos.returnCoordinates(search);
// 	//console.log(values);
// 	return [...values];
// }

const config = {
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
	strictSSL: true // optional - requires SSL certificates to be valid.
};

// Create a new Twit object.
const T = new Twit(config);
async function getTweets(topic, radius = 1, count = 100, latitude, longitude) {
	// Array to store tweets
	let tweets = [];

	// date
	let date = moment().format('L');
	// Get coordinates for the given city
	//let coordinates = await fetchWithCoordinates(city);
	//let coordinates = [52.23287730811029, 21.001052856445316];

	// Query parameters
	let query = {
		// Query param (+ remove retweets)
		q: `${topic} -filter:retweets`,
		// Language chosen
		lang: 'en',
		// Coordinates with radius in km
		geocode: `${latitude},${longitude},${radius}km`,
		// Number of tweets to fetch. Max. 100
		count: count,
		// Get full text
		tweet_mode: 'extended'
	};

	// Fetch the tweets for the given city and given topic.
	await T.get('search/tweets', query)
		.catch(function(err) {
			console.error('caught error', err.stack);
		})
		.then(function(result) {
			let resultTweets = result.data.statuses;
			//console.log(resultTweets);
			resultTweets.map(tweet => {
				tweets.push({
					username: tweet.user.screen_name,
					tweet: tweet.full_text,
					topic: topic,
					coordinates: [latitude, longitude],
					date: date,
					radius: radius,
					image: tweet.user.profile_image_url,
					name: tweet.user.name,
					createdAt: tweet.created_at
				});
			});
		});

	if (tweets.length == 0) {
		console.log('No tweets for this city or topic!');
		return [];
	}
	// Return an array of objects with username and tweets
	return tweets;
}

module.exports = { getTweets };
