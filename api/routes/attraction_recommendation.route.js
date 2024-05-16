const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

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
