const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpApp")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO CONNECTION ERROR!!!");
    console.log(err);
  });

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  firstname: {
    type: String,
    required: [true, "firstname is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

userSchema.statics.findAndValidate = async function (username, password) {
  const user = await this.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password);
  return validPassword ? user : false;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //   this.password = "HIJACKED!";
  next();
});

module.exports = mongoose.model("User", userSchema);
