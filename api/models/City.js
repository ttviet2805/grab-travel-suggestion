const mongoose = require('mongoose');

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

module.exports = City;
