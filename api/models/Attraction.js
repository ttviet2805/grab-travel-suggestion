const mongoose = require('mongoose');

// Define the Schema for an attraction
const AttractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, { collection: 'attraction' });

// Create a model from the schema
const Attraction = mongoose.model('Attraction', AttractionSchema);

// Export the model
module.exports = Attraction;