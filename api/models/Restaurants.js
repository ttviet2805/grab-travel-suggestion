const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the restaurant schema
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: true
    }
}, { collection: 'restaurant' });

// Create the model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;