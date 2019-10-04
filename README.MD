# sentimap

A sentiment analyzer for Twitter made with TensorFlowJS and CNN.

### To install

Open terminal & go to the project folder

The server requires Twitter API keys & an instance of mongodb running.
Create an .env file containing the following information.

```
# MongoDB connection
DB_CONNECTION=mongodb://localhost:27017/sentiment-analysis

# Twitter
CONSUMER_KEY=<YOUR CONSUMER KEY>
CONSUMER_SECRET=<YOU CONSUMER SECRET>
ACCESS_TOKEN=<YOUR ACCESS TOKEN>
ACCESS_TOKEN_SECRET=<YOUR ACCESS TOKEN SECRET>
TIMEOUT_MS=60000
STRICTSSL=true
```

Then, we can install the dependencies and start the server.

```
cd server
npm install
nodemon start
```

Open a second window for the client

```
cd client
npm install
npm start
```
