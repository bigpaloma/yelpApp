const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    rating: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Review', reviewSchema);