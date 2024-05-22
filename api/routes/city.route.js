const express = require('express');
const City = require('../models/City');
const router = express.Router();

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Retrieve a list of cities
 *     description: Returns a list of cities along with state, country, latitude, and longitude.
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "San Francisco"
 *                   state:
 *                     type: string
 *                     example: "CA"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     example: 37.7749
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     example: -122.4194
 *       500:
 *         description: Server error
 */
// GET endpoint to get list of all cities
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find({}).select('city state country latitude longitude -_id');
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cities', error: error });
    }
});

/**
 * @swagger
 * /api/nearby-city/{cityName}:
 *   get:
 *     summary: Retrieve nearby cities
 *     description: Returns a list of cities that are in the same location cluster as the provided city name but are not the provided city itself.
 *     parameters:
 *       - in: path
 *         name: cityName
 *         required: true
 *         description: The name of the city to find nearby cities.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of nearby cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Đà Nẵng"
 *                   state:
 *                     type: string
 *                     example: "Quảng Nam"
 *                   country:
 *                     type: string
 *                     example: "Vietnam"
 *                   latitude:
 *                     type: number
 *                     format: double
 *                     example: 16.054407
 *                   longitude:
 *                     type: number
 *                     format: double
 *                     example: 108.202167
 *       404:
 *         description: The city was not found
 *       500:
 *         description: Server error
 */
// GET endpoint to get list of all nearby cities
router.get('/nearby-city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName;
        const city = await City.findOne({ city: cityName }).select('loc_clusters');
        if (!city) {
            return res.status(404).json({ error: "City not found." });
        }

        const nearbyCities = await City.find({
            loc_clusters: city.loc_clusters,
            city: { $ne: cityName }
        }).select('city state country latitude longitude');

        const result = nearbyCities.map(c => ({
            city: c.city,
            state: c.state,
            country: c.country,
            latitude: c.latitude,
            longitude: c.longitude
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching nearby cities: " + error.message });
    }
});

module.exports = router;
