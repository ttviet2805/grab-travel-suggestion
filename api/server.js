const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'City API',
        version: '1.0.0',
        description: 'API to manage city data',
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./server.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB Atlas with tgrabvel database name
mongoose.connect(
    'mongodb+srv://ttviet2805:grabbootcamp@cluster0.hb7fvkv.mongodb.net/tgrabvel',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("MongoDB connected successfully to tgrabvel database!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit();
});

// Define a schema that matches the structure in the `city` collection
const CitySchema = new mongoose.Schema({
    name: String,
    province_name: String,
    country_name: String,
    latitude: Number,
    longitude: Number
}, { collection: 'city' });  // Specify the collection name as 'city'

// Create a model for city
const City = mongoose.model('City', CitySchema);

/**
 * @swagger
 * /cities:
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
 *                 description: The name of a city.
 *       500:
 *         description: Error fetching cities.
 */
app.get('/cities', async (req, res) => {
    try {
        const cities = await City.find({}).select('name');  // Only retrieve the 'name' field
        res.json(cities.map(city => city.name));  // Return an array of city names
    } catch (error) {
        res.status(500).send("Error fetching cities: " + error);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
