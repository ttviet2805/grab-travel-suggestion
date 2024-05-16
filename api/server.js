const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const citiesRouter = require('./routes/city.route');
const attractionRecommendationRouter = require('./routes/attraction_recommendation.route');

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
    apis: ['./routes/*.js'],
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

// Use for routes
app.use('/api', citiesRouter);
app.use('/api', attractionRecommendationRouter);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
