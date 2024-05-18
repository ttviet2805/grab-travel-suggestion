const express = require('express');
const State = require('../models/State');
const router = express.Router();

/**
 * @swagger
 * /api/states:
 *   get:
 *     summary: Get all states
 *     description: Returns a list of all states along with their associated countries
 *     responses:
 *       200:
 *         description: A list of states and countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   state:
 *                     type: string
 *                     example: "An Giang"
 *                   country:
 *                     type: string
 *                     example: "Vietnam"
 *       500:
 *         description: Server error
 */
// GET to get list of all states
router.get('/states', async (req, res) => {
    try {
        const states = await State.find({}).select('state country');
        res.json(states.map(state => ({
            state: state.state,
            country: state.country,
        })));
    } catch (error) {
        res.status(500).json({ error: "Error fetching states: " + error.message });
    }
});

module.exports = router;