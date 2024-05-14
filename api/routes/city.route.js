const express = require('express');
const City = require('../models/City');
const router = express.Router();

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Retrieve a list of city names
 *     description: Returns a list of city names from the `city` collection.
 *     responses:
 *       200:
 *         description: A list of city names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"]
 *       500:
 *         description: Error fetching cities.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching cities: <error_message>"
 */
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find({}).select('city');  // Only retrieve the 'city' field
        res.json(cities.map(city => city.city));  // Return an array of city names
    } catch (error) {
        res.status(500).json({ error: "Error fetching cities: " + error });
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
