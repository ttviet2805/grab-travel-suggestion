const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

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
// Route to get recommendations for a state
router.get('/recommendations/:state', (req, res) => {
    const state = req.params.state;
    const pythonProcess = spawn('python', ['./attraction_crawl/attraction_crawl.py', state]);

    pythonProcess.stdout.on('data', (data) => {
        try {
            const recommendations = JSON.parse(data.toString());
            res.status(200).json({
                success: true,
                state: state,
                recommendations: recommendations
            });
        } catch (err) {
            res.status(500).json({ success: false, message: "Failed to parse Python response" });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        res.status(500).json({ success: false, message: data.toString() });
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process closed with code ${code}`);
        if (code !== 0) {
            res.status(500).json({ success: false, message: "Python process exited with code " + code });
        }
    });
});

module.exports = router;
