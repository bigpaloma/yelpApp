const mongoose = require('mongoose');
const Review = require("./review")
const {cloudinary} = require("../cloudinary");
const Schema = mongoose.Schema;     

const campgroundsSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    images: [{
        url: String,
        filename: String
    }],
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
    for(let i = 0; i < doc.images.length; i++) {
        let image = doc.images[i]
        console.log(image.filename)
        await cloudinary.uploader.destroy(image.filename)
    }
    // console.log(doc.images.length)
    // console.log(doc.images[1])
    // const aha = doc.images[1]
    // console.log(aha["filename"])
}
});

module.exports = mongoose.model('Campground', campgroundsSchema);