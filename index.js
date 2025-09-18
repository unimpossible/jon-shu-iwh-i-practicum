const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config()
PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;


// Homepage route. Render a table of custom objects
app.get('/', async (req, res) => {
    const customObjectUrl = "https://api.hubapi.com/crm/v3/objects/2-50257223?properties=address,asking_price,year_built";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(customObjectUrl, { headers });
        const data = resp.data.results;
        res.render("homepage", { data });
    } catch (error) {
        console.error(error);
        res.json({ 'error': true });
    }
});

// Form for adding a new custom object
app.get('/update-cobj', async (req, res) => {
    res.render("updates");
});

// Upload a new custom object entry
app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "address": req.body.address,
            "asking_price": req.body.asking_price,
            "year_built": req.body.year_built
        }
    }

    const createObjectUrl = "https://api.hubapi.com/crm/v3/objects/2-50257223";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createObjectUrl, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.json({'error':true});
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));