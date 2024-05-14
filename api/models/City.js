const mongoose = require('mongoose');

// Define a schema that matches the new structure in the `city` collection
const CitySchema = new mongoose.Schema({
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number,
    loc_clusters: Number
}, { collection: 'city' });   // Specify the collection name as 'city'

// Create a model for city
const City = mongoose.model('City', CitySchema);

module.exports = City;
