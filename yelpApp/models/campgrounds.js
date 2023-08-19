const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const campgroundsSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: "Review"
    }]
})

module.exports = mongoose.model('Campground', campgroundsSchema);