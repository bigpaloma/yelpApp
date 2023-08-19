const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpApp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO CONNECTION ERROR!!!")
        console.log(err)
    })


const Blog = require("./subreddit")

const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    addresses: [{
        _id: { _id: false },
        street: String,
        city: String,
        zip: String,
    }],
    subreddits: [{ type: Schema.Types.ObjectId, ref: "Blog" }]
});

const User = mongoose.model('User', userSchema);

const newUser = async () => {
    const u = await new User({
        username: "bigpaloma",
        firstname: "Furkan",
        lastname: "Senguen",
        addresses: [{
            street: "Violaweg",
            city: "Kaiseraugst",
            zip: "4303"
        }]
    })
    const res = await u.save()
    // console.log(res);
}

const addAddress = async (id, street, city, zip) => {
    const user = await User.findById(id);
    await user.addresses.push({
        street: street,
        city: city,
        zip: zip,
    })
    const updatedUser = await user.save();
    console.log(updatedUser);
}

// newUser()

// addAddress("64ce78405fb2d2b281984178", "Duggingerhof", "Basel", "4053")

const subscribe = async () => {
    const user = await User.findOne({ username: "bigpaloma" });
    console.log("****************", user);
    const sub = await Blog.findOne({ name: "Leckermalane" });
    console.log("****************", sub);
    await user.subreddits.push(sub);
    console.log("****************", user);
    await user.save();
    console.log("***************", user);
};

// subscribe();

const del = async () => {
    const found = await User.findByIdAndDelete("64ce78dda2f94a42808dcce7");
    console.log(found);
}

// del()

User.findOne({ username: "bigpaloma" }).populate("subreddits").then(user => console.log(user.subreddits));