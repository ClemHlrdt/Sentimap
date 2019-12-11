import * as tf from "@tensorflow/tfjs";
const emojiSn = require("emoji-to-short-name");
const contractions = require("contractions");

const emotions = [
  "disgust",
  "sadness",
  "shame",
  "joy",
  "guilt",
  "fear",
  "anger"
];
export async function preprocess(tweets) {
  //console.log(tweets);
  // Get an array of tokenized tweets
  let tokens = tokenizeArray(tweets);
  // Get an array of sequences
  let sequences = await getSequenceNumberOfArray(tokens);
  // Pad the sequences
  let sequencesPadded = await padSequenceOfArray(sequences, 350);
  return sequencesPadded;
}

// Load the dictionary of words
async function loadDict() {
  try {
    let response = await fetch(
      "https://sentimap-nodejs-api.herokuapp.com//word_dict.json"
    );
    // only proceed once promise is resolved
    let data = await response.json();

    // only proceed once second promise is resolved
    let dict = await data;

    return dict;
  } catch (error) {
    console.log("Couldn't load the dictionary", error);
  }
}

// Call tokenize of each sentence of the array and returns [sentence1[], sentence2[],...]
function tokenizeArray(sentences) {
  const arrayOfSentences = [];
  sentences.map(sentence => {
    const colon = /:/gi;
    const mention = /\B@\w+/g;
    const links = /(https?:\/\/[^\s]+)/g;
    const hashtags = /#/gi;
    let clearSentence = sentence
      .replace(links, " ")
      .replace(mention, " ")
      .replace(hashtags, " ");

    let sentenceNoEmojis = emojiSn
      .encode(clearSentence)
      .replace(colon, " ")
      .replace("’", "'")
      .replace(/undefined/g, " ");

    let expanded = contractions
      .expand(sentenceNoEmojis)
      .trim()
      .toLowerCase()
      .replace(mention, "")
      .replace(/_/g, " ")
      //eslint-disable-next-line
      .replace(/(\.|\,|\!|\"|\;')/gi, "")
      .split(" ")
      .filter(Boolean);

    arrayOfSentences.push(expanded);
    return "";
  });

  return arrayOfSentences;
}

//
async function getSequenceNumberOfArray(tokens) {
  // load dict
  let dict = await loadDict();
  // Create an empty array
  const arrayOfSequences = [];

  // loop through each sentence
  //eslint-disable-next-line
  tokens.map(sentence => {
    // Empty sequence array
    const sequence = [];
    //eslint-disable-next-line
    sentence.map(word => {
      if (dict.hasOwnProperty(word)) {
        sequence.push(dict[word]);
      }
    });
    arrayOfSequences.push(sequence);
  });
  return arrayOfSequences;
}

async function padSequenceOfArray(sequences, len) {
  const arrayOfPaddedSequences = [];
  //eslint-disable-next-line
  sequences.map(sequence => {
    // Create an array of numbers of the given length
    let zeros = Array(len - sequence.length).fill(0);
    let paddedSequence = zeros.concat(sequence);
    arrayOfPaddedSequences.push(paddedSequence);
  });
  //console.log(arrayOfPaddedSequences);
  return arrayOfPaddedSequences;
}

export async function predict(tweets, model) {
  const tweetText = tweets.map(tweet => tweet.tweet);
  console.log(tweetText.length);
  let sequences = await preprocess(tweetText);
  // sequences: [Array(350),...]

  // Creation of a tensor
  const inputData = tf.tensor2d(sequences, [tweets.length, 350]);

  // Predictions
  const result = model.predict(inputData);
  const results = result.dataSync();

  const classifiedTweets = [];

  const newList = listToMatrix(results, 7);
  // newList: [Array(7),...]
  //eslint-disable-next-line
  newList.map((results, index) => {
    // Create an empty object for a tweet
    //console.log({ results, index });
    let tweet = {
      text: "",
      emotion: "",
      results: []
    };

    let percentages = results.map(value => Math.round(value * 100));

    // indexEmotion: index of the highest probability
    let indexEmotion = results.indexOf(Math.max(...results));
    //console.log({ indexEmotion });
    tweet.username = tweets[index].username;
    tweet.name = tweets[index].name;
    tweet.image = tweets[index].image;
    tweet.text = tweets[index].tweet;
    tweet.emotion = emotions[indexEmotion];
    tweet.results = percentages;
    tweet.emojis = ["🤮", "😭", "😔", "😀", "😶", "😱", "😡"];
    tweet.date = tweets[index].createdAt;
    classifiedTweets.push(tweet);
  });

  return classifiedTweets;
}

// Take the results and make an array with each probabilities
function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;
  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    matrix[k].push(list[i]);
  }
  return matrix;
}
