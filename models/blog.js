var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
})

var blog = mongoose.model("blog", blogSchema);

module.exports = blog;