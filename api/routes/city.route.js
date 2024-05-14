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

module.exports = router;
