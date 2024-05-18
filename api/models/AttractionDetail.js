const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the review schema
const reviewSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }, // Ratings can be stored as strings to keep the format consistent
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

// Define the review score schema
const reviewScoreSchema = new Schema({
    "0": {
        type: Number,
    },
    "1.0": {
        type: Number,
    },
    "2.0": {
        type: Number,
    },
    "3.0": {
        type: Number,
    },
    "4.0": {
        type: Number,
    },
    "5.0": {
        type: Number,
    }
});

// Define the attraction details schema
const attractionDetailSchema = new Schema({
    name: {
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
    },
    rating: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    num_review: {
        type: Number,
        required: true
    },
    review_score: reviewScoreSchema,
    review: [reviewSchema]
}, { collection: 'attraction_detail' });

// Create the model
const AttractionDetail = mongoose.model('AttractionDetail', attractionDetailSchema);

module.exports = AttractionDetail;
