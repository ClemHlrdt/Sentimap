const axios = require('axios');
const process = require('process');
//const API = require('../../config/locationiq.config.js');
require('dotenv/config');

// Get a city latitude and lon
async function returnCoordinates(search) {
    try {
        const res = axios.get(
            `https://eu1.locationiq.com/v1/search.php?key=${
                process.env.LOCATIONIQ_TOKEN
            }&q=${search}&format=json`
        );
        let result = await res;
        return [result.data[0].lat, result.data[0].lon];
        // let result = [51.509865, -0.118092];
        // return result;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { returnCoordinates };
