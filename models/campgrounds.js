const mongoose = require('mongoose');
const Review = require("./review")
const User = require("./user")
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
    }],
    owner: {
        type: Schema.Types.ObjectId, ref: "User"
    }
})

campgroundsSchema.post("findOneAndDelete", async function(doc) {
    if(doc){
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
    }
});

module.exports = mongoose.model('Campground', campgroundsSchema);