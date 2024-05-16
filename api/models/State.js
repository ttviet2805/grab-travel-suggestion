const mongoose = require('mongoose');

// Define the Schema for a state
const StateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, { collection: 'state' });

// Create a model from the schema
const State = mongoose.model('State', StateSchema);

// Export the model
module.exports = State;