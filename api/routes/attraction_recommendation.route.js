const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const Attraction = require('../models/Attraction');

/**
 * @swagger
 * /api/recommendations/{state}:
 *   get:
 *     summary: Get recommendations for a state
 *     description: Retrieves a list of recommended places or attractions for a specified state by running a Python script that crawls data.
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         type: string
 *         description: The name of the state for which to get recommendations.
 *     responses:
 *       200:
 *         description: A successful response containing recommendations for the state.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 state:
 *                   type: string
 *                   example: "California"
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the recommended location.
 *                         example: "Disneyland Park"
 *                       rating:
 *                         type: string
 *                         description: The average user rating of the location.
 *                         example: "4.7"
 *                       tag:
 *                         type: string
 *                         description: The category tag of the location.
 *                         example: "Theme Park"
 *                       image:
 *                         type: string
 *                         description: A URL to an image of the location.
 *                         example: "https://example.com/disneyland.jpg"
 *     500:
 *         description: An error occurred, either from parsing the Python script output or from the script itself.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to parse Python response"
 */
async function findAttractionsByState(stateName) {
    try {
        const attractions = await Attraction.find({ state: stateName }, { _id: 0, url: 0 }).limit(10);;
        return attractions;
    } catch (error) {
        throw error;  // Rethrow the error to be handled by the caller
    }
}

// Function to handle spawning the Python process and parsing its output
async function getRecommendations(state) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./attraction_crawl/attraction_crawl.py', state]);

        let dataBuffer = '';
        let errorBuffer = '';

        pythonProcess.stdout.on('data', (data) => {
            dataBuffer += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorBuffer += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python process exited with code ${code}: ${errorBuffer}`));
            }
            try {
                const recommendations = JSON.parse(dataBuffer);
                resolve(recommendations);
            } catch (err) {
                reject(new Error('Failed to parse Python response'));
            }
        });
    });
}

// Route to get recommendations for a state
router.get('/recommendations/:state', async (req, res) => {
    const state = req.params.state;
    try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Python script timeout')), 15000));  // 30-second timeout
        const recommendations = await Promise.race([getRecommendations(state), timeoutPromise]);

        // Check if recommendations are valid
        if (recommendations.length > 0 && recommendations[0]['image'] !== "") {
            res.status(200).json({
                success: true,
                state: state,
                recommendations: recommendations
            });
        } else {
            throw new Error('Invalid recommendations Image data');
        }
    } catch (error) {
        console.error('Python script failed or timed out, fetching data from MongoDB:', error);
        try {
            // If python process is unsuccessful, collect backup data in database
            const recommendations = await findAttractionsByState(state);
            res.status(200).json({
                success: true,
                state: state,
                backup: true,
                recommendations: recommendations
            });
        } catch (dbError) {
            res.status(500).json({ success: false, message: dbError.message });
        }
    }
});

module.exports = router;
