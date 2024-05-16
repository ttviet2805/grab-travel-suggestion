const express = require('express');
const City = require('../models/City');
const router = express.Router();

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Retrieve detailed information of cities
 *     description: Fetches detailed information of cities including their names, states, countries, and geographical coordinates.
 *     responses:
 *       200:
 *         description: An array of city objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The name of the city.
 *                   state:
 *                     type: string
 *                     description: The state or region where the city is located.
 *                   country:
 *                     type: string
 *                     description: The country in which the city is located.
 *                   latitude:
 *                     type: number
 *                     format: float
 *                     description: The latitude coordinate of the city.
 *                   longitude:
 *                     type: number
 *                     format: float
 *                     description: The longitude coordinate of the city.
 *             examples:
 *               application/json:
 *                 - city: "Huế"
 *                   state: "Thừa Thiên Huế"
 *                   country: "Vietnam"
 *                   latitude: 16.4637
 *                   longitude: 107.5909
 *       500:
 *         description: Error fetching city information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching city information: <error_message>"
 */
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find({}).select('city state country latitude longitude');
        res.json(cities.map(city => ({
            city: city.city,
            state: city.state,
            country: city.country,
            latitude: city.latitude,
            longitude: city.longitude
        })));
    } catch (error) {
        res.status(500).json({ error: "Error fetching cities: " + error.message });
    }
});

/**
 * @swagger
 * /api/nearby-city/{city}:
 *   get:
 *     summary: Retrieve nearby cities
 *     description: Returns a list of cities that have the same loc_clusters value as the input city.
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         description: Name of the city to find nearby cities for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of nearby cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Nearby City 1", "Nearby City 2", "Nearby City 3"]
 *       404:
 *         description: City not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "City not found: <city_name>"
 *       500:
 *         description: Error fetching nearby cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching nearby cities: <error_message>"
 */
router.get('/nearby-city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName;
        const city = await City.findOne({ city: cityName });
        if (!city) {
            return res.status(404).json({ error: "City not found." });
        }
        const nearbyCities = await City.find({
            loc_clusters: city.loc_clusters,
            city: { $ne: cityName }
        }).select('city');
        res.json(nearbyCities.map(c => c.city));
    } catch (error) {
        res.status(500).json({ error: "Error fetching nearby cities: " + error });
    }
});

module.exports = router;
