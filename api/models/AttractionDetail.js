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
    },
    title: {
        type: String,
        required: true
    },
    time: String,
    type_trip: String,
    content: {
        type: String,
        required: true
    },
});

// Define the review score schema
const reviewScoreSchema = new Schema({
    "0": Number,
    "1": Number,
    "2": Number,
    "3": Number,
    "4": Number,
    "5": Number
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
    tag_split: [String],
    num_review: {
        type: Number,
        required: true
    },
    review_score: reviewScoreSchema,
    review: [reviewSchema],
    weight: Number
}, { collection: 'attraction_detail' });

// Create the model
const AttractionDetail = mongoose.model('AttractionDetail', attractionDetailSchema);

module.exports = AttractionDetail;
