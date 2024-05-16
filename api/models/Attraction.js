const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the attraction
const attractionSchema = new Schema({
    attraction: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

// Create a model from the schema
const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;