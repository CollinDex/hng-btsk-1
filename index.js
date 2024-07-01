const express = require('express');
const axios = require('axios');
const app = express();


//middleware
app.use(express.json());

//api
const baseUrl =  "http://api.weatherapi.com/v1"

//env
const API_KEY = process.env.API_KEY;

//Initialize server to listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//API GET
app.get('/', (req, res) => {
    res.send('Hello From Node Api');
});

//API GET 
app.get('/api/hello/:visitor_name', async (req, res) => {
    try {
        const { visitor_name } = req.params;

        //Get Client IP
        let client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        //Clean up IPv6 address format
        if (client_ip.includes('::ffff:')) {
            client_ip = client_ip.split('::ffff:')[1];
        };

        console.log("API_KEY", API_KEY);

        //Get location from geolocation api
        const weatherResponse = await axios.get(`${baseUrl}/current.json?key=${API_KEY}&q=auto:ip`);
        const { location, current } = weatherResponse.data;
        const { name: city } = location;
        const { temp_c: temperature } = current;


        const greeting = `Hello, ${visitor_name}! The temperature is ${temperature} degrees Celsius in ${city}`;

        // Send the response
        res.status(200).json({
            client_ip: client_ip,
            location: city,
            greeting: greeting
        });

    } catch (error) {
        // Handle Errors
        res.status(500).json({message: error.message});
    }
});