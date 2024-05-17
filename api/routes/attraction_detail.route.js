const express = require('express');
const router = express.Router();
const AttractionDetail = require('../models/attractionDetail');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

/**
 * @swagger
 * /api/attraction_detail/{name}:
 *   get:
 *     tags:
 *       - Attraction
 *     summary: Retrieve attraction details along with related hotels and restaurants
 *     description: Fetches detailed information about an attraction by its name and provides related hotels and restaurants in the same state.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         type: string
 *         description: Name of the attraction
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved the attraction details along with related hotels and restaurants
 *         examples:
 *           application/json:
 *             attraction:
 *               name: "White Sand Dunes"
 *               image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ca/81/5f/the-white-sand-dunes.jpg?w=500&h=400&s=1"
 *               state: "Binh Thuan Province"
 *               rating: "4.0"
 *               tag: "Points of Interest & Landmarks"
 *               num_review: 10
 *               review_score: {"0": 0, "1.0": 0, "2.0": 3, "3.0": 1, "4.0": 3, "5.0": 3}
 *               review:
 *                 - username: "Alex H"
 *                   rating: "5.0"
 *                   title: "Nice sunrise"
 *                   content: "We did the sunrise tour to the white sand dunes and arrived here at around 5:15am ish, after using the tour through our Mui Ne Budget Hotel."
 *             hotel:
 *               - name: "The Cliff Resort & Residences"
 *                 rating: "5.0"
 *                 url: "tripadvisor.com/Hotel_Review-g298086-d3478132-Reviews-The_Cliff_Resort_Residences-Phan_Thiet_Binh_Thuan_Province.html"
 *                 image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/eb/3f/b3/the-cliff-resort-residences.jpg?w=300&h=300&s=1"
 *                 state: "Binh Thuan Province"
 *             restaurant:
 *               - name: "Vista Restaurant"
 *                 rating: "5.0"
 *                 url: "tripadvisor.com/Restaurant_Review-g1009804-d15362879-Reviews-Vista_Restaurant-Mui_Ne_Phan_Thiet_Binh_Thuan_Province.html"
 *                 image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/98/7f/72/vista-restaurant.jpg?w=600&h=400&s=1"
 *                 state: "Binh Thuan Province"
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Server error
 */
// GET endpoint to fetch attraction details by name
router.get('/attraction_detail/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const attraction = await AttractionDetail.findOne({ name: name }, { _id: 0 });

        if (!attraction) {
            return res.status(404).json({ message: 'Attraction not found' });
        }

        const hotel = await Hotel.find({ state: attraction.state }, { _id: 0 });
        const restaurant = await Restaurant.find({ state: attraction.state }, { _id: 0 });

        res.json({
            attraction: attraction,
            hotel: hotel,
            restaurant: restaurant
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
