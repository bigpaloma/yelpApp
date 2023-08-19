const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpApp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO CONNECTION ERROR!!!")
        console.log(err)
    })

const { Schema } = mongoose;

const blogSchema = new Schema({
    name: String,
    subscribers: Number,
    description: String,
    isNSFW: {
        type: Boolean,
        default: false
    }
})

const Blog = mongoose.model("Blog", blogSchema);

const newBlog = async () => {
    const b = await Blog.insertMany([
        {
            name: "Leckermalane",
            subscribers: 7845,
            description: "Mir esses alle mananas!!"
        }, {
            name: "bilent",
            subscribers: 78,
            description: "fans vo bilent"
        }, {
            name: "SCHABRAKS",
            subscribers: 8888,
            description: "HEILIGE schabrakkos!"
        }
    ])
    console.log(b);
}

// newBlog();

module.exports = mongoose.model("Blog", blogSchema);