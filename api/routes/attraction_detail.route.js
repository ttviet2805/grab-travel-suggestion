const express = require('express');
const { format } = require('date-fns');
const router = express.Router();
const AttractionDetail = require('../models/AttractionDetail');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

/**
 * @swagger
 * /api/attraction-detail/{name}:
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
router.get('/attraction-detail/:name', async (req, res) => {
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

/**
 * @swagger
 * /api/add-review:
 *   post:
 *     summary: Add a review for an attraction
 *     description: This endpoint allows users to post a review for an attraction.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attraction
 *               - username
 *               - rating
 *               - type_trip
 *               - title
 *               - content
 *             properties:
 *               attraction:
 *                 type: string
 *                 description: Name of the attraction
 *               username:
 *                 type: string
 *                 description: Username of the reviewer
 *               rating:
 *                 type: string
 *                 description: Rating given by the reviewer, expected to be a string that can be parsed into a number
 *               type_trip:
 *                 type: string
 *                 description: Type of trip (e.g., Family, Solo, Business, Couples, Friends)
 *               title:
 *                 type: string
 *                 description: Title of the review
 *               content:
 *                 type: string
 *                 description: Detailed content of the review
 *             example:
 *               attraction: "White Sand Dunes"
 *               username: "ttviet"
 *               rating: "5"
 *               type_trip: "Family"
 *               title: "Amazing"
 *               content: "The landscape is breathtaking with vast white sands."
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 review:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     rating:
 *                       type: string
 *                     type_trip:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *       400:
 *         description: Bad request, missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing fields
 *       404:
 *         description: Attraction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating that the attraction was not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating an internal error
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
// Route to add a new review to an attraction
router.post('/add-review', async (req, res) => {
    // Destructure fields from request body
    const { attraction, username, rating, type_trip, title, content } = req.body;

    // Validate if all required fields are provided
    if (!attraction || !username || !rating || !type_trip || !title || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Get current request time and format it
    const requestTime = new Date();
    const formattedRequestTime = format(requestTime, 'MMM yyyy');

    try {
        // Find the attractionDetail document by name
        const attractionDetail = await AttractionDetail.findOne({ name: attraction });

        // If no attraction is found, return a 404 error
        if (!attractionDetail) {
            return res.status(404).json({ message: 'Attraction not found' });
        }

        // Create a new review object
        var ratingProcess = Math.floor(parseFloat(rating)).toString();
        const newReview = {
            username,
            rating: ratingProcess,
            title,
            "time": formattedRequestTime,
            type_trip,
            content
        };

        // Add the new review at the beginning of the reviews array
        attractionDetail.review.unshift(newReview);
        attractionDetail.num_review++;
        attractionDetail.review_score[ratingProcess]++;

        // Save the updated document to the database
        await attractionDetail.save();

        // Respond with success message and the added review
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        // Handle any other errors that occur during the process
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

/**
 * @swagger
 * /api/top-trending-attractions:
 *   get:
 *     summary: Retrieves the top 50 trending attractions based on a weighted score
 *     description: This endpoint calculates the weighted score for attractions based on the 'weight' field and returns the top 50 attractions sorted by this score. Each attraction is the top attraction per state.
 *     tags:
 *       - Attractions
 *     responses:
 *       200:
 *         description: An array of top trending attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the attraction
 *                   state:
 *                     type: string
 *                     description: State where the attraction is located
 *                   rating:
 *                     type: string
 *                     description: Overall rating of the attraction
 *                   url:
 *                     type: string
 *                     description: URL to the attraction detail page
 *                   tag:
 *                     type: string
 *                     description: Tag associated with the attraction
 *                   image:
 *                     type: string
 *                     description: URL of the image representing the attraction
 *                   weight:
 *                     type: number
 *                     description: Calculated weight of the attraction
 *             example:
 *               - name: "Sunset Beach"
 *                 state: "California"
 *                 rating: "4.5"
 *                 url: "http://example.com/attractions/sunset-beach"
 *                 tag: "Beach"
 *                 image: "http://example.com/images/sunset-beach.jpg"
 *                 weight: 98.3
 *               - name: "Historic Museum"
 *                 state: "New York"
 *                 rating: "4.2"
 *                 url: "http://example.com/attractions/historic-museum"
 *                 tag: "Museum"
 *                 image: "http://example.com/images/historic-museum.jpg"
 *                 weight: 92.5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the failure of fetching attractions
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
// Route to get top trending attractions based on our calculation
router.get('/top-trending-attractions', async (req, res) => {
    try {
        const attractions = await AttractionDetail.aggregate([
            { $sort: { weight: -1 } }, // Sort by weight in descending order first
            {
                $group: {
                    _id: "$state",
                    topAttraction: { $first: "$$ROOT" } // Get the top attraction per state
                }
            },
            { $replaceRoot: { newRoot: "$topAttraction" } }, // Replace the root to make the top attraction the main document
            { $sort: { weight: -1 } }, // Additional sort to order all top attractions by weight
            {
                $project: {
                    _id: 0,
                    name: 1,
                    state: 1,
                    rating: 1,
                    url: 1,
                    tag: 1,
                    image: 1,
                    weight: 1
                }
            },
            { $limit: 50 } // Limit to top 30 attractions overall
        ]);

        res.json(attractions);
    } catch (error) {
        console.error('Failed to fetch top attractions:', error);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});

module.exports = router;
