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
        const locationResponse = await axios.get(`${baseUrl}/ip.json?key=3ee659f3b5ce45a1b0681059240107&q=auto:ip`);
        const { ip } = locationResponse.data;
        console.log(ip);

        console.log("API_KEY", API_KEY);        

        //Get location from geolocation api
        const weatherResponse = await axios.get(`${baseUrl}/current.json?key=3ee659f3b5ce45a1b0681059240107&q=${ip}`);
        const { location, current } = weatherResponse.data;
        const { name: city } = location;
        const { temp_c: temperature } = current;

        const greeting = `Hello, ${visitor_name}! The temperature is ${temperature} degrees Celsius in ${city}`;

        // Send the response
        res.status(200).json({
            client_ip: ip,
            location: city,
            greeting: greeting
        });

    } catch (error) {
        // Handle Errors
        res.status(500).json({message: error.message});
    }
});