const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema that matches the new structure in the `hotel` collection
const hotelSchema = new Schema({
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
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, { collection: 'hotel' });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
