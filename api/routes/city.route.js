const express = require('express');
const City = require('../models/City');
const router = express.Router();

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
        }).select('city state country latitude longitude'); // Only fetch required fields

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
