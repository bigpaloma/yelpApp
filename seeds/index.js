const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpApp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Campgrounds = require("../models/campgrounds");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const seedDB = async () => {
    await Campgrounds.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 1400) + 200;
        const randomplace = Math.floor(Math.random() * places.length);
        const randomdesc = Math.floor(Math.random() * descriptors.length);
        const c = new Campgrounds({
            name: `${places[randomplace]} ${descriptors[randomdesc]}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: "https://random.imagecdn.app/500/500",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At obcaecati nemo nostrum necessitatibus, corrupti perspiciatis commodi facere taskere.",
            price: randomPrice
        });
        await c.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});
