const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

/**
 * @swagger
 * /api/recommendations/{city}:
 *   get:
 *     summary: Get recommendations for a city
 *     description: Retrieves a list of recommended places or attractions for a specified city by running a Python script that crawls data.
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         type: string
 *         description: The name of the city for which to get recommendations.
 *     responses:
 *       200:
 *         description: A successful response containing recommendations for the city.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 city:
 *                   type: string
 *                   example: "Tam Ky"
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the recommended location.
 *                         example: "Tam Thanh Beach"
 *                       rating:
 *                         type: string
 *                         description: The average user rating of the location.
 *                         example: "4.5"
 *                       tag:
 *                         type: string
 *                         description: The category tag of the location.
 *                         example: "Beaches"
 *                       image:
 *                         type: string
 *                         description: A URL to an image of the location.
 *                         example: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/94/28/83/bi-n-l-ng-gio-tam-thanh.jpg?w=500&h=400&s=1"
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
// Route to get recommendations for a city
router.get('/recommendations/:city', (req, res) => {
    const city = req.params.city;
    const pythonProcess = spawn('python', ['./attraction_crawl/attraction_crawl.py', city]);

    pythonProcess.stdout.on('data', (data) => {
        try {
            const recommendations = JSON.parse(data.toString());
            res.status(200).json({
                success: true,
                city: city,
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
