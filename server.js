// Au cas où on a besoin de faire de faire un endpoint HTTP

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const BASE_URL = 'https://impactco2.fr/api/v1';

async function getTransportData(km, transports) {
    try {
        const params = {
            km,
            transports,
            displayAll: 0,
            ignoreRadiativeForcing: 0,
            occupencyRate: 1,
            includeConstruction: 0,
            language: 'fr'
        };

        const response = await axios.get(`${BASE_URL}/transport`, {
            params,
            headers: { accept: 'application/json' }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Erreur API : ${error.response.status} ${JSON.stringify(error.response.data)}`);
        } else {
            throw new Error(`Erreur réseau : ${error.message}`);
        }
    }
}

// Endpoint GET /transport?km=...&transports=...
app.get('/transport', async (req, res) => {
    const { km, transports } = req.query;

    if (!km || !transports) {
        return res.status(400).json({ error: 'Paramètres km et transports requis.' });
    }

    try {
        const data = await getTransportData(Number(km), Number(transports));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
