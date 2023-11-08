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
            owner: "64f4d73dc7a871574e89322f",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. At obcaecati nemo nostrum necessitatibus, corrupti perspiciatis commodi facere taskere.",
            price: randomPrice,
            images: [
                {
                  url: 'https://res.cloudinary.com/dhu9ixwgr/image/upload/v1697110305/YelpCamp/sbwcos8ijphgob9ytdsm.png',        
                  filename: 'YelpCamp/sbwcos8ijphgob9ytdsm',
                },
                {
                  url: 'https://res.cloudinary.com/dhu9ixwgr/image/upload/v1697110307/YelpCamp/bklvn1lhsdlyrvrp7fqm.png',        
                  filename: 'YelpCamp/bklvn1lhsdlyrvrp7fqm',
                }
              ]
        });
        await c.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});

