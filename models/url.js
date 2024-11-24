const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const Schema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: Number,
        required: true,
        unique: true
    }
});

const Url = mongoose.model("Url", Schema);
module.exports = Url;
