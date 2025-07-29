require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = '2-47982613';
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=pet_nam&properties=pet_type&properties=pet_color`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    };

    try {
        const resp = await axios.get(endpoint, {
            headers,
        });

        const data = resp.data.results;
        console.log(data);
        res.render('homepage', { title: 'Custom Object Records', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve custom object records.');
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here


app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newRecord = {
        properties: {
            pet_nam: req.body.pet_nam,
            pet_type: req.body.pet_type,
            pet_color: req.body.pet_color
        }
    };

    try {
        await axios.post(endpoint, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create custom object record.');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));